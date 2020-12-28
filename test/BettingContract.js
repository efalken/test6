const Betting = artifacts.require("Betting");
const Token = artifacts.require("Token");
const Oracle = artifacts.require("Oracle");

require('chai').use(require('chai-as-promised')).should();

contract('Betting', function (accounts) {

    describe('Oracle', async () => {
        it('Get Oracle Contract Address', async () => {
            const betting = await Betting.deployed();
            console.log(`Oracle Address is ${await betting.oracleAdmin()}`);
        })
    })


    describe("token", async () => {
        it('Send Betting/Oracle contract to Token', async () => {
            const token = await Token.deployed();
            const betting = await Betting.deployed();
            const bettingAddress = betting.address;
            const oracleAddress = await betting.oracleAdmin();
            await token.proposeContract(bettingAddress, oracleAddress);
        })

        it('Finalize Betting/Oracle contract to Token', async () => {
            const token = await Token.deployed();
            await token.processVote();
        })

        it('Authorize Oracle Token', async () => {
            const token = await Token.deployed();
            const betting = await Betting.deployed();
            const oracleAddress = await betting.oracleAdmin();
            await token.approve(oracleAddress, "100000000000000000000000");
        })
    })

    describe("Oracle Operations", async () => {
        it("Deposit Tokens in Oracle Contract", async () => {
            const oracle = await Oracle.deployed();
            await oracle.depositTokens("100000000000000000000000");
        })

        it("send initial data", async () => {
            const oracle = await Oracle.deployed();
            await oracle.initPost(["NFL:Ariz:Lv", "NFL:Atl:LAC", "NFL:Bal:LAR", "NFL:Buf:Mia", "NFL:Car:Min", "NFL:Chi:NE", "NFL:Cin:NO", "NFL:Cle:NYG", "NFL:Dal:NYJ", "NFL:Den:Phi", "NFL:Det:Pitt", "NFL:GB:SF", "NFL:Hou:Sea", "NFL:Ind:TB", "NFL:Jac:Ten", "NFL:Kan:Wash", "UFC:Figueiredo:Moreno", "UFC:Oliveira:Ferguson", "UFC:Dern:Jandiroba", "UFC:Holland:Souza", "UFC:Gane:dosSantos", "UFC:Swanson:Pineda", "NA:NA:NA", "NA:NA:NA", "NA:NA:NA", "NA:NA:NA", "NA:NA:NA", "NA:NA:NA", "NA:NA:NA", "NA:NA:NA", "NA:NA:NA", "NA:NA:NA"], [1609466400, 1609466400, 1609466400, 1608843600, 1609466400, 1608843600, 1609466400, 1609466400, 1609466400, 1608843600, 1609466400, 1609466400, 1609466400, 1609466400, 1609466400, 1609466400, 1609466400, 1609466400, 1609466400, 1609466400, 1609466400, 1609466400, 1608843600, 1608843600, 1608843600, 1608843600, 1608843600, 1608843600, 1608843600, 1608843600, 1608843600, 1608843600], [909, 1500, 1000, 2450, 909, 1505, 2505, 1005, 909, 1505, 1005, 1005, 909, 1505, 2505, 1005, 1005, 1005, 1005, 1005, 1005, 1005, 1005, 1005, 1005, 1005, 1005, 1005, 1005, 1005, 1005, 1000], 1609466400);
        })

        it("Finalize Initial Data", async () => {
            const oracle = await Oracle.deployed();
            await oracle.initProcess();
        })
        it("Fund Betting Contract", async () => {
            const betting = await Betting.deployed();
            await betting.fundBook({ from: accounts[0], value: '100000000000000000' });
        })

    });

    describe("Send Some Bets", async () => {
        it("Send Wrong Bet (Excess Amount Should Fail)", async () => {
            const betting = await Betting.deployed();
            // 50 finney
            await betting.bet(0, 0, { from: accounts[1], value: '50000000000000000' });
        })

        it("Send Correct Bet #1", async () => {
            const betting = await Betting.deployed();
            // 10 finney
            await betting.bet(0, 0, { from: accounts[1], value: '10000000000000000' });
        })

        it("Send Correct Bet #2", async () => {
            const betting = await Betting.deployed();
            // 15 finney
            await betting.bet(0, 1, { from: accounts[1], value: '15000000000000000' });
        })

        it("Send Correct Bet #3", async () => {
            const betting = await Betting.deployed();
            // 10 finney
            await betting.bet(0, 0, { from: accounts[1], value: '10000000000000000' });
        })
        let contractHash;
        it("Offer Big Bet", async () => {
            const betting = await Betting.deployed();
            // 100 finney
            const result = await betting.betBig(1, 0, { from: accounts[1], value: '100000000000000000' });
            contractHash = result.logs[0].args.contractHash;
        })

        it("Take Big Bet", async () => {
            const betting = await Betting.deployed();
            // 100 finney
            await betting.takeBig(contractHash, { from: accounts[1], value: '150000000000000000' });
        })
    })

    describe("Oracle Result", async () => {
        it("Send Event Results", async () => {
            const oracle = await Oracle.deployed();
            await oracle.settlePost([1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]);
        });

        it("send initial data", async () => {
            const oracle = await Oracle.deployed();
            await oracle.settleProcess();
        });
    })

    describe("Get Final Data", async () => {
        it("Check State Variables in Betting Contract", async () => {
            const betting = await Betting.deployed();
            const result = await betting.showMargin();
            console.log(result);
        })
    })

})