import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "./redux/blockchain/blockchainActions";
import { fetchData } from "./redux/data/dataActions";
import * as s from "./styles/globalStyles";
import styled from "styled-components";

import nagaImg01 from "./styles/img/Naga_21-22.png"
import pic1 from "./styles/img/item1.png"
import pic2 from "./styles/img/Character-02.png"
import pic3 from "./styles/img/Character-05.png"
import nagaEgg from "./styles/Egg-04.png"
import eggGif from "./styles/naga-egg.gif"
import nagaLogo from "./styles/Draft_2-04.png"
import facebookIcon from "./styles/facebook-round-color.svg"
import discordIcon from "./styles/discord.svg"
import twitterIcon from "./styles/twitter-round-color.svg"

const truncate = (input, len) =>
  input.length > len ? `${input.substring(0, len)}...` : input;

export const StyledButton = styled.button`

`;

export const StyledRoundButton = styled.button`

`;

export const ResponsiveWrapper = styled.div`

`;

export const StyledLogo = styled.img`

`;

export const StyledImg = styled.img`

`;

export const StyledLink = styled.a`

`;

function App() {
  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
  const data = useSelector((state) => state.data);
  const [approved, setApproved] = useState(false);
  const [claimingNft, setClaimingNft] = useState(false);
  const [feedback, setFeedback] = useState(`Click buy to mint your NFT.`);
  const [mintAmount, setMintAmount] = useState(1);
  const [CONFIG, SET_CONFIG] = useState({
    CONTRACT_ADDRESS: "",
    SCAN_LINK: "",
    NETWORK: {
      NAME: "",
      SYMBOL: "",
      ID: 0,
    },
    NFT_NAME: "",
    SYMBOL: "",
    MAX_SUPPLY: 1,
    WEI_COST: 0,
    DISPLAY_COST: 0,
    GAS_LIMIT: 0,
    MARKETPLACE: "",
    MARKETPLACE_LINK: "",
    SHOW_BACKGROUND: false,
  });

  const claimNFTs = () => {
    let cost = CONFIG.WEI_COST;
    let gasLimit = CONFIG.GAS_LIMIT;
    let totalCostWei = String(cost * mintAmount);
    let totalGasLimit = String(gasLimit * mintAmount);
    console.log("Cost: ", totalCostWei);
    console.log("Gas limit: ", totalGasLimit);
    setFeedback(`Minting your ${CONFIG.NFT_NAME}...`);
    setClaimingNft(true);
    blockchain.smartContract.methods
      .mint(mintAmount)
      .send({
        gasLimit: String(totalGasLimit),
        to: CONFIG.CONTRACT_ADDRESS,
        from: blockchain.account,
      })
      .once("error", (err) => {
        console.log(err);
        setFeedback("Sorry, something went wrong please try again later.");
        setClaimingNft(false);
      })
      .then((receipt) => {
        console.log(receipt);
        setFeedback(
          `the ${CONFIG.NFT_NAME} is yours! go visit Opensea.io to view it.`
        );
        setClaimingNft(false);
        dispatch(fetchData(blockchain.account));
      });
  };

  const approve = () => {
    let cost = CONFIG.WEI_COST;
    let gasLimit = CONFIG.GAS_LIMIT;
    let totalCostWei = String(cost * mintAmount);
    let totalGasLimit = String(gasLimit * mintAmount);
    console.log("Cost: ", totalCostWei);
    console.log("Gas limit: ", totalGasLimit);
    setFeedback(`Approving WETH for ${CONFIG.NFT_NAME}...`);
    setClaimingNft(true);
    console.log(blockchain)
    blockchain.tokenContract.methods
      .approve(CONFIG.CONTRACT_ADDRESS, "1000000000000000000000000000000")
      .send({
        gasLimit: String(totalGasLimit),
        to: CONFIG.CONTRACT_ADDRESS,
        from: blockchain.account,
      })
      .once("error", (err) => {
        console.log(err);
        setFeedback("Sorry, something went wrong please try again later.");
        setClaimingNft(false);
      })
      .then((receipt) => {
        console.log(receipt);
        setFeedback(
          `WETH approved, let mint ${CONFIG.NFT_NAME}.`
        );
        setClaimingNft(false);
        dispatch(fetchData(blockchain.account));
        setApproved(true);
      });
  };

  const decrementMintAmount = () => {
    let newMintAmount = mintAmount - 1;
    if (newMintAmount < 1) {
      newMintAmount = 1;
    }
    setMintAmount(newMintAmount);
  };

  const incrementMintAmount = () => {
    let newMintAmount = mintAmount + 1;
    if (newMintAmount > 10) {
      newMintAmount = 10;
    }
    setMintAmount(newMintAmount);
  };

  const getData = () => {
    if (blockchain.account !== "" && blockchain.smartContract !== null) {
      dispatch(fetchData(blockchain.account));
    }
  };

  const getConfig = async () => {
    const configResponse = await fetch("/config/config.json", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    const config = await configResponse.json();
    SET_CONFIG(config);
  };

  useEffect(() => {
    getConfig();
  }, []);

  useEffect(() => {
    getData();
  }, [blockchain.account]);

  return (
    <div className="all-wrapper">
      <div className="nagaLogo">
      <img src={nagaLogo} alt="" />
      </div>
        <section className="wave-section">

        <div className="nagaEgg">
            <img src={eggGif} alt=""></img>
        </div>

        <div className="mint-interface">
              {Number(data.totalSupply) >= CONFIG.MAX_SUPPLY ? (
                <div>
                  <div>
                    The sale has ended.
                  </div>

                    You can still find {CONFIG.NFT_NAME} on

                  <StyledLink target={"_blank"} href={CONFIG.MARKETPLACE_LINK}>
                    {CONFIG.MARKETPLACE}
                  </StyledLink>
                </div>
              ) : (
                <div>

                  {blockchain.account === "" ||
                  blockchain.smartContract === null ? (
                    <div className="connect-div">

                      <button className="buy-btn glow-on-hover"
                        onClick={(e) => {
                          e.preventDefault();
                          dispatch(connect());
                          getData();
                        }}
                      >
                        CONNECT
                      </button>

                      <div className="connect-div-p">
                        Connect to the Polygon Network
                        </div>

                      {blockchain.errorMsg !== "" ? (
                        <div>
                            {blockchain.errorMsg}
                        </div>
                      ) : null}
                    </div>
                  ) : (
                      <div className="after-connected">

                        {/* {feedback} */}

                      <div className="mint-amount">
                        <button
                          style={{ lineHeight: 0.4 }}
                          disabled={claimingNft ? 1 : 0}
                          onClick={(e) => {
                            e.preventDefault();
                            decrementMintAmount();
                          }}
                        >
                          −
                        </button>

                          {mintAmount}

                        <button
                          disabled={claimingNft ? 1 : 0}
                          onClick={(e) => {
                            e.preventDefault();
                            incrementMintAmount();
                          }}
                        >
                          +
                        </button>
                      </div>

                      <div className="mint-btn">
                        {!approved &&
                          <button
                            className="buy-btn glow-on-hover"
                            disabled={claimingNft ? 1 : 0}
                            onClick={(e) => {
                              e.preventDefault();
                              approve();
                              getData();
                            }}
                          >
                            {claimingNft ? "APPROVING..." : "APPROVE WETH"}
                          </button>
                        }

                        {approved &&
                          <button
                            className="buy-btn"
                            disabled={claimingNft ? 1 : 0}
                            onClick={(e) => {
                              e.preventDefault();
                              claimNFTs();
                              getData();
                            }}
                          >
                            {claimingNft ? "BUYING..." : "BUY"}
                          </button>
                        }
                      </div>

                      {feedback}

                      <div className="connected-to">Connected to {blockchain.account}</div>
                    </div>
                  )}
                </div>
              )}
        </div>

          <a className="nagasec move">
            <img className="nagasec nagaimg" src={nagaImg01} alt="" />
          </a>

          <div className="wave wave1" />
          <div className="wave wave2" />
          <div className="wave wave3" />
          <div className="wave wave4" />
          <div className="wave wave5" />
          <div className="wave wave6" />
        </section>


        <div className="bot-nav-container">
          <div className="bot-nav">
            {/* <div className="bot-nav-address">
              <StyledLink target={"_blank"} href={CONFIG.SCAN_LINK}>
                  contract adddress: {truncate(CONFIG.CONTRACT_ADDRESS, 15)}
                </StyledLink>
            </div> */}
              <div className="bot-nav-minted">
                {data.totalSupply} / {CONFIG.MAX_SUPPLY}
              </div>

              <div className="bot-nav-price">
              1 {CONFIG.SYMBOL} ☰ {CONFIG.DISPLAY_COST}{" "}
                    {CONFIG.NETWORK.SYMBOL}
              </div>

          </div>
        </div>


      <section className="section">
        <div className="section-inner">
          <div className="inner-text">
            <h2>What is Naga DAO?</h2>
            <p>
              Naga DAO is an organization operating under the concept of
              Decentralized Autonomous Organization (DAO) which is a group of people
              working together using Blockchain technology as a tool. Decentralized
              the power of the founder and spread it to other members.{" "}
            </p>
            <p>
              It's like a club where people can work together from all over the
              world without using trust but relying on verifiable transparency on
              the Blockchain.
            </p>
          </div>
          <div className="inner-img"
          data-aos="fade-down-left" 
          data-aos-duration="1000" 
          data-aos-once="true" 
          data-aos-anchor-placement="top-center">
            <img src={pic2} alt="" className="img-resize-mobile"/>
          </div>
        </div>
      </section>
      <section className="section" style={{ backgroundColor: "#c4dbcc" }}>
        <div className="section-inner">
          <div className="inner-img"
          data-aos="fade-down-right" 
          data-aos-duration="1000" 
          data-aos-once="true" 
          data-aos-anchor-placement="top-center">
            <img src={pic1} alt="" />
          </div>
          <div className="inner-text alter">
            <h2>Naga DAO's Goal</h2>
            <p>Naga DAO was created to be a Thai NFT Incubator for all people.</p>
            <p>
              It is a group of people who believe in NFT technology and want to
              deliver opportunity to everyone who wants to find an opportunity to
              earn money with NFT. and to cooperate in educating and help anyone who
              wants to learn about NFT.
            </p>
          </div>
        </div>
      </section>
      {/* <section className="section">
        <div className="section-inner">
          <table>
            <tbody>
              <tr>
                <th>Type</th>
                <th>&nbsp;</th>
                <th>Variation</th>
                <th>&nbsp;</th>
              </tr>
              <tr>
                <td>1,000</td>
                <td>Total Naga</td>
                <td>60</td>
                <td>Body</td>
              </tr>
              <tr>
                <td>Common</td>
                <td>TBD</td>
                <td>50</td>
                <td>Cheek</td>
              </tr>
              <tr>
                <td>Uncommon</td>
                <td>TBD</td>
                <td>30</td>
                <td>Eyes</td>
              </tr>
              <tr>
                <td>Rare</td>
                <td>TBD</td>
                <td>20</td>
                <td>Mouths</td>
              </tr>
              <tr>
                <td>Ultra Rare</td>
                <td>TBD</td>
                <td>10</td>
                <td>Clothes</td>
              </tr>
              <tr>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                <td>8</td>
                <td>Background</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section> */}
      <section className="section">
        <div className="section-inner">
          <div className="inner-text">
            <h2>Naga DAO NFT</h2>
            <p>
              Naga DAO will have a total of 10K NFTs for members. Whitelists can be
              requested by working within the group. March 2nd is the day that
              whitelisters can mint through website for 0.03 ETH and March 3rd for
              Public Sale all NFT will be on Polygon Chain.
            </p>
            <p>
              Naga NFT holders will receive special privileges such as meeting with
              the team to advise on the project. Access to exclusive members-only
              events, access to team-based Research NFT projects, and access to
              Naga's Metaverse will be built on the sandbox.
            </p>
          </div>
          <div className="inner-img" 
          data-aos="fade-down-left" 
          data-aos-duration="1000" 
          data-aos-once="true" 
          data-aos-anchor-placement="top-center">
            <img src={pic3} alt="" className="img-resize-mobile" />
          </div>
        </div>
      </section>


      <section className="section" style={{backgroundColor: "#00100f"}}>
        <div className="footer">
            <div className="footer-div">
                <p className="footer-div-p">
                    Join Us!
                </p>
            </div>

            <div className="icon">
                <a href="https://discord.gg/DF7krb8uNq" className="a-link discord">
                    <img src={discordIcon} alt=""></img>
                </a>
                <a href="https://www.facebook.com/nagadaonft/" className="a-link facebook">
                    <img src={facebookIcon} alt=""></img>
                </a>
                <a href="https://twitter.com/The_NagaDAO" className="a-link twitter">
                    <img src={twitterIcon} alt=""></img>
                </a>
            </div>
        </div>
    </section>

    </div>
  );
}

export default App;
