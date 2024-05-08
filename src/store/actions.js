

export const updatesqId = (id) => ({
    type: 'UPDATESQID',
    id,
});

export const updateSqnm = (data) => ({
    type: 'UPDATESQNM',
    data
});



export const addNode = (data) => ({
    type: 'ADDNODE',
    payload: data
});

export const updateNode = (id,data,choice) => ({
    type: 'UPDATENODE',
    id,
    data,
    choice
});

export const resetSequence = () => ({
    type: 'RESET_SEQUENCE'
  });
  