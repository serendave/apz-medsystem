import React, { useEffect, useState } from 'react';
import { makeStyles, Paper } from '@material-ui/core';
import { Table } from '../../components';
import { api } from '../../config';

const useStyles = makeStyles({
  root: {
    padding: 16,
    margin: '16px auto',
    maxWidth: 1200
  }
});

const Requests = () => {
  const classes = useStyles();
  const [requestData, setRequestData] = useState([]);

  useEffect(() => {
    api.get('/requests').then((result) => {
      if (result.data.status === 'success') {
        const data = result.data.data.docs.map((request) => ({
          id: request._id,
          patinet: request.patinetId.fullName,
          requesttype: request.requestType,
          priority: request.priority,
          status: request.status,
        }));

        setRequestData(data);
      }
    });
  }, []);

  return (
    <>
      <Paper className={classes.root}>
        <Table
          header={'Requests'}
          headCells={[
            {
              id: 'patient',
              numeric: false,
              disablePadding: true,
              label: 'Patient',
              notAlignRight: true
            },
            { id: 'requesttype', numeric: false, disablePadding: true, label: 'Request Type' },
            { id: 'priority', numeric: false, disablePadding: false, label: 'Priority' },
            { id: 'status', numeric: true, disablePadding: false, label: 'Status' }
          ]}
          rowsData={requestData}
          initialOrderProp={'patient'}
          rowsPerPage={10}
        />
      </Paper>
    </>
  );
};

export default Requests;