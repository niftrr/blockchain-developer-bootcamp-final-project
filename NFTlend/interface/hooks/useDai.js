import { useWeb3React } from "@web3-react/core";
// import { useAppContext } from "../AppContext";

const useDai = () => {
    const { active, library, account } = useWeb3React();
    const { lendDaiBalance, setLendDaiBalance } = useAppContext();

    const fetchLendDaiBalance = async () => {
        if (library && active && account) {
            const balance = 'foo';
            setLendDaiBalance(balance);
        } else {
            setLendDaiBalance('--');
        }
    };
    return { lendDaiBalance, fetchLendDaiBalance };
};

export default useDai;