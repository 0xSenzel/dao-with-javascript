import { useAddress, useMetamask, useEditionDrop, useToken, useVote, useNetwork } from '@thirdweb-dev/react';
import { useState, useEffect, useMemo } from 'react';
import { AddressZero } from "@ethersproject/constants";
import { ChainId } from '@thirdweb-dev/sdk';

const App = () => {
  // Use the hooks thirdweb give us.
  const address = useAddress();
  const connectWithMetamask = useMetamask();
  console.log("👋 Address:", address);

  // Initialize our editionDrop contract
  const editionDrop = useEditionDrop("0xc97a2d64251abb84D7A0fA57988b4E0CA4D5Bc51");
  // Initialize our token contract
  const token = useToken("0x76E588796f14ee43c031296e2c3DD3a6ceb3e3FE");
  // Initialize our vote contract
  const vote = useVote("0x3E62046687f3A20d5D167f3aE248f652AD29aa32");
  // Initialize network
  const network = useNetwork();
  // State variable for us to know if usr has our NFT
  const [hasClaimedNFT, setHasClaimedNFT] = useState(false);
  // isClaiming let us easily keep a loading state while the NFT is minting
  const[isClaiming, setIsClaiming] = useState(false);
  // Holds the amount of token each member has in state
  const [memberTokenAmounts, setMemberTokenAmounts] = useState([]);
  //The array holding all of our members addresses
  const [memberAddresses, setMemberAddresses] = useState([]);
  // Holds the proposal
  const [proposals, setProposals] = useState([]);
  // Keep track of when proposal is currrently in voting state
  const [isVoting, setIsVoting] = useState(false);
  // Keep track of when proposal has done voting
  const [hasVoted, setHasVoted] = useState(false);

  // A function to shorten someones wallet address, no need to show the whole thing
  const shortenAddress = (str) => {
    return str.substring(0, 6) + "..." + str.substring(str.length - 4);
  };

  // This useEffect grabs all the addresses of our members holding our NFT
  useEffect(() => {
    if(!hasClaimedNFT) {
      return;
    }
    // Grab the users who hold our NFT with tokenId 0
    const getAllAddresses = async () => {
      try {
        const memberAddresses = await editionDrop.history.getAllClaimerAddresses(0)
        setMemberAddresses(memberAddresses);
        console.log("🚀 Members addresses", memberAddresses);
      } catch (error) {
        console.error("Failed to get member list", error);
      }

    };

    getAllAddresses();
  }, [hasClaimedNFT, editionDrop.history]);


  // Retrieve all our existing proposals from the contract
  useEffect(() => {
    if (!hasClaimedNFT) {
      return;
    }
    // Simple call to vote.getAll() to grab the proposals
    const getAllProposals = async () => {
      try {
        const proposals = await vote.getAll();
        setProposals(proposals);
        console.log("🌈 Proposals:", proposals);
      } catch (error) {
        console.log("failed to get proposals", error)
      }
    };

    getAllProposals();
  }, [hasClaimedNFT, vote]);

  // Check if the user already voted
  useEffect(() => {
    if (!hasClaimedNFT) {
      return;
    }
    // Check if we retrieved any proposals
    if (!proposals.length) {
      return;
    }

    const checkIfUserHasVoted = async () => {
      try {
        const hasVoted = await vote.hasVoted(proposals[0].proposalId, address);
        setHasVoted(hasVoted);
        if (hasVoted) {
          console.log("🥵 User has already voted");
        } else {
          console.log("🙂 User has not voted yet");
        }
      } catch (error) {
        console.error("Failed to check if wallet has voted", error);
      }
    };

    checkIfUserHasVoted();
  }, [hasClaimedNFT, proposals, address, vote]);

  // This useEffect grabs the # of token each member holds
  useEffect(() => {
    if(!hasClaimedNFT) {
      return;
    }

    const getAllBalances = async () => {
      try {
        const amounts = await token.history.getAllHolderBalances();
        setMemberTokenAmounts(amounts);
        console.log("👜 Amounts", amounts);
      } catch (error) {
        console.error("Failed to get member balances", error);
      }
    };

    getAllBalances();
  }, [hasClaimedNFT, token.history]);

  // Combine memberAddresses and memberTokenAmounts into a single array
  const memberList = useMemo(() => {
    return memberAddresses.map((address) => {
      // Checking if we are finding the address in the memberTokenAmounts array
      // If we are, return the amount of token the user has
      // otherwise, return 0
      const member = memberTokenAmounts?.find(({ holder }) => holder === address);

      return {
        address,
        tokenAmount: member?.balance.displayValue || "0"
      }
    });
  }, [memberAddresses, memberTokenAmounts]);

  // Check the wallet address status
  useEffect(() => {
    // If they don't have a connected wallet, exit!
    if(!address) {
      return;
    }

    const checkBalance = async () => {
      try {
        const balance = await editionDrop.balanceOf(address, 0);
        if (balance.gt(0)) {
          setHasClaimedNFT(true);
          console.log("🌟 this user has a membership NFT!");
        } else {
          setHasClaimedNFT(false);
          console.log("😭 this user doesn't have a membership NFT.");
        }
      } catch (error) {
        setHasClaimedNFT(false);
        console.error("Failed to get balance", error);
      }
    };
    checkBalance();
  },[address, editionDrop]);

  const mintNFT = async () => {
    try {
      setIsClaiming(true);
      // Mint tokenID[0], quantity 1 to user
      await editionDrop.claim("0", 1);
      console.log(`🌊 Successfully Minted! Check it out on OpenSea: https://testnets.opensea.io/assets/${editionDrop.getAddress()}/0`);
      setHasClaimedNFT(true);
    } catch (error) {
      setHasClaimedNFT(false);
      console.error("Failed to mint NFT", error);
    } finally {
      setIsClaiming(false);
    }
  };

  // Check if user is on Goerli testnet
  if (address && (network?.[0].data.chain.id !== ChainId.Goerli)) {
    return (
      <div className='unsupported-network'>
        <h2>Please connect to Goerli</h2>
        <p>
          This dapp only works on the Goerli network, please switch network
          in your connected wallet. 
        </p>
      </div>
    );
  }

  // This is the case where the user hasn't connected their wallet
  // to your web app. Let them call connectWallet
  if(!address) {
    return (
      <div className="landing">
        <h1>Welcome to SecureDAO</h1>
        <button onClick={connectWithMetamask} className="btn-hero">
          Connect your wallet
        </button>
      </div>
    );
  }

  // If user has claimed NFT, display internal DAO page
  if (hasClaimedNFT) {
    return (
      <div className='member-page'>
        <h1>🍪DAO Member Page</h1>
        <p>Congratulations on being a member</p>
        <div>
          <div>
            <h2>Member List</h2>
            <table className='card'>
              <thead>
                <tr>
                  <th>Address</th>
                  <th>Token Amount</th>
                </tr>
              </thead>
              <tbody>
                {memberList.map((member) => {
                  return (
                    <tr key={member.address}>
                      <td>{shortenAddress(member.address)}</td>
                      <td>{member.tokenAmount}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div>
            <h2>Active Proposals</h2>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                e.stopPropagation();

                //before we do async things, disable the button to prevent double clicks
                setIsVoting(true);

                // Get the votes from the form for the values
                const votes = proposals.map((proposal) => {
                  const voteResult = {
                    proposalId: proposal.proposalId,
                    //abstain by default
                    vote: 2,
                  };
                  proposal.votes.forEach((vote) => {
                    const elem = document.getElementById(
                      proposal.proposalId + "-" + vote.type
                    );

                    if (elem.checked) {
                      voteResult.vote = vote.type;
                      return;
                    }
                  });
                  return voteResult;
                });

                // Make sure the user delegates their token to vote
                try {
                  // Check if the wallet still needs to delegate their tokens before they can vote
                  const delegation = await token.getDelegationOf(address);
                  // if the delegation is the 0x0 address that means they have not delegated their governance tokens
                  if (delegation === AddressZero) {
                    //if they haven delegated tokens, we'll have them delegate them before voting
                    await token.delegateTo(address);
                  }
                  // Vote on the proposals
                  try {
                    await Promise.all(
                      votes.map(async ({ proposalId, vote: _vote }) => {
                        // Before voting, check whether the proposal is open for voting
                        // Get the latest state of the proposal
                        const proposal = await vote.get(proposalId);
                        // Check if the proposal is open for voting (state ===)
                        if (proposal.state === 1) {
                          // if it is open for voting, proceed to vote
                          return vote.vote(proposalId, _vote);
                        }
                        // if the proposal is closed for voting, return nothing
                        return;
                      })
                    );
                    try {
                      // Check if any of the propsals are ready to be executed
                      // a proposal is ready to be executed if it is in state 4
                      await Promise.all(
                        votes.map(async ({ proposalId }) => {
                          // Get the latest state of the proposal
                          const proposal = await vote.get(proposalId);

                          //if the state is in state 4, execute the proposal
                          if (proposal.state === 4) {
                            return vote.execute(proposalId);
                          }
                        })
                      );
                      // if we get here that means we successfully voted, so let's set the "hasVoted" state to true
                      setHasVoted(true);
                      console.log("successfully voted");
                    } catch (err) {
                      console.error("failed to execute votes", err);
                    }
                  } catch (err) {
                    console.error("failed to vote", err);
                  }
                } catch (err) {
                  console.error("failed to delegate tokens");
                } finally {
                  // in *either* case we need to set the isVoting state to false to enable the button again
                  setIsVoting(false);
                }
              }}
            >
              {proposals.map((proposal) => (
                <div key={proposal.proposalId} className="card">
                  <h5>{proposal.description}</h5>
                  <div>
                    {proposal.votes.map(({ type, label }) => (
                      <div key={type}>
                        <input
                          type="radio"
                          id={proposal.proposalId + "-" + type}
                          name={proposal.proposalId}
                          value={type}
                          //default the "abstain" vote to checked
                          defaultChecked={type === 2}
                        />
                        <label htmlFor={proposal.proposalId + "-" + type}>
                          {label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              <button disabled={isVoting || hasVoted} type="submit">
                {isVoting
                  ? "Voting..."
                  : hasVoted
                    ? "You Already Voted"
                    : "Submit Votes"}
              </button>
              {!hasVoted && (
                <small>
                  This will trigger multiple transactions that you will need to
                  sign.
                </small>
              )}
            </form>
          </div>
        </div>
      </div>
    );
  };

  // Render mint nft screen
  return (
    <div className='mint-nft'>
      <h1>Mint your free 🍪DAO Membership NFT</h1>
      <button
      disabled={isClaiming}
      onClick={mintNFT}
      >
        {isClaiming ? "Minting...": "Mint your nft (FREE)"}
      </button>
    </div>
  );
/*
  // This is the case where we have the user's address
  // which means they've connected their wallet to our site!
  return (
    <div className="landing">
      <h1>👀 wallet connected, now what!</h1>
    </div>
  ); */

}

export default App;
