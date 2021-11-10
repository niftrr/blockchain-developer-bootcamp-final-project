import React, { useEffect, useMemo, useState } from 'react';
import { Container } from 'react-bootstrap';
import { useAppContext } from '../../AppContext';
import useTransaction from '../../hooks/useTransaction';
import "./TransactionStatus.css";

const TransactionStatus = () => {

    const { txnStatus, setTxnStatus } = useTransaction();
    if (txnStatus === 'LOADING') {
        return (
        <Container show="true">
            <div className="transaction-status">
                Loading..
            </div>
        </Container>
        );
      }
    
      if (txnStatus === 'COMPLETE') {
        return (
          <Container show="true">
            <div className="transaction-status">
                Txn Successful!
            </div>
          </Container>
        );
      }
    
      if (txnStatus === 'ERROR') {
        return (
          <Container show="true">
            <div className="transaction-status">
              Txn ERROR
            </div>
          </Container>
        );
      }
      return (
        <Container show="true">
        </Container>
      );
};

export default TransactionStatus;

