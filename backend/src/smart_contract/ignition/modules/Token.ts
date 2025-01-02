const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

        const TokenModule = buildModule("TokenModule", (m:any) => {
//        const cloneFactory = m.getParameter("cloneFactory","0xACA38AaD6171EC03D744E530876d67d3Ed449CFf");
//        const erc20Template = m.getParameter("erc20Template","0x443c8F29B15EFB63BE7067e749620328AaBB6C40");
//        const customErc20Template = m.getParameter("customErc20Template","0x0bAcb6aC1826ded459624794E5b60a4FcFc6a6e1");
//        const customMintableErc20Template = m.getParameter("customMintableErc20Template","0x941c28A0e801a979715c0724C5dFd8ad225836B1");
//        const customLiquidityErc20Template = m.getParameter("customLiquidityErc20Template","0x65F41D4884F517874519ddee2BE2793166dA6D88");
//        const createFee = m.getParameter("createFee",1000000000000000);
//        const token = m.contract("ERC20V3Factory",[cloneFactory,erc20Template,customErc20Template,customMintableErc20Template,customLiquidityErc20Template,createFee]);
                const token = m.contract("CustomLiquidityToken")
        return { token };
        });

        module.exports = TokenModule;
// const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

//         const TokenModule = buildModule("TokenModule", (m:any) => {
//        const cloneFactory = m.getParameter("cloneFactory","0x870E10c4EDF97A5ED3D683079DbC64FC59d6B866");
//        const erc20Template = m.getParameter("erc20Template","0xB508B033073DB82031cc2e0385ee400F34373D29");
//        const customErc20Template = m.getParameter("customErc20Template","0xF786438c36Adf3da08356C4197F39c5fC727e575");
//        const customMintableErc20Template = m.getParameter("customMintableErc20Template","0x1E3787c4fB90E594a48326870cc9a64946ec0b0b");
//        const customLiquidityErc20Template = m.getParameter("customLiquidityErc20Template","0xc7241614C7A4c928763bf5fEBe8d3464ac9A0Bb5");
//        const createFee = m.getParameter("createFee",1000000);
//        const token = m.contract("ERC20V3Factory",[cloneFactory,erc20Template,customErc20Template,customMintableErc20Template,customLiquidityErc20Template,createFee])

//         return { token };
//         });

//         module.exports = TokenModule;