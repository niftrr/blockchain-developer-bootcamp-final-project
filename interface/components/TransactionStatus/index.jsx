import React, { useEffect, useMemo, useState } from 'react';
import { useWeb3React } from "@web3-react/core";
import { SpinnerCircular } from 'spinners-react';
import { Container } from 'react-bootstrap';
import { useAppContext } from '../../AppContext';
import useTransaction from '../../hooks/useTransaction';
import "./TransactionStatus.css";



const TransactionStatus = () => {
  const { account } = useWeb3React();
  const { txnStatus, setTxnStatus } = useTransaction();

  useEffect(() => {
    if (account) {
      console.log('txn');
    }  
  }, [account, txnStatus]);

  if (txnStatus === 'LOADING') {
      return (
      <Container show="true" className="container-status  oxanium-extra-light-web-orange-18px">
          <div className="transaction-status">
            <SpinnerCircular size={50} thickness={100} speed={100} color="rgba(255, 168, 0, 1)" secondaryColor="rgba(0, 0, 0, 0.44)" />
            
          </div>
          <div>Loading....</div>
      </Container>
      );
    }

    if (txnStatus === 'ACCEPTING') {
      return (
      <Container show="true" className='container-status oxanium-extra-light-web-orange-18px'>
          <div className="transaction-status">
            <SpinnerCircular size={50} thickness={100} speed={100} color="rgba(255, 168, 0, 1)" secondaryColor="rgba(0, 0, 0, 0.44)" />
          </div>
          <div>Accepting...</div>
      </Container>
      );
    }
  
    if (txnStatus === 'TRANSFERRING') {
      return (
      <Container show="true" className="container-status  oxanium-extra-light-web-orange-18px">
          <div className="transaction-status">
            <SpinnerCircular size={50} thickness={100} speed={100} color="rgba(255, 168, 0, 1)" secondaryColor="rgba(0, 0, 0, 0.44)" /> 
          </div>
          <div>Transferring..</div>
      </Container>
      );
    }

    if (txnStatus === 'COMPLETE') {
      return (
        <Container show="true" className="container-status  oxanium-extra-light-web-orange-18px">
          <div className="transaction-status">
          </div>
          <div>Success!</div>
        </Container>
      );
    }
  
    if (txnStatus === 'ERROR') {
      return (
        <Container show="true" className="container-status  oxanium-extra-light-web-orange-18px">
          <div className="transaction-status">
          </div>
          <div>Txn ERROR</div>
        </Container>
      );
    }
    return (
      <Container show="true">
      </Container>
    );
};

export default TransactionStatus;

