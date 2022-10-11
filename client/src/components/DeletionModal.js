import { useContext } from 'react';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import { GlobalStoreContext } from '../store';
import Stack from '@mui/material/Stack';

export default function DeletionModal(){
    const { store } = useContext(GlobalStoreContext);

    let name = "";
    if(store.listMarkedForDeletion){
        name = store.listMarkedForDeletion.name;
    }

    const style = {
        position: 'relative',
        top: '50%',
        // bottom: '50%',
        left: '50%',
        // right: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
        // px: 4,
        // pb: 3
    };

    const handleConfirm = (event) => {
        event.preventDefault();
        store.deleteList(store.listMarkedForDeletion);
        store.unmarkListForDeletion();
    }
    const handleCancel = (event) => {
        event.preventDefault();
        store.unmarkListForDeletion();
    }

    return(
        <Modal
        open={store.listMarkedForDeletion===null? false : true}
        aria-labelledby="deletion-modal-title"
        aria-describedby="deletion-modal-description"
        style={{display:'flex', alginItem:"center", justifyContent:'center'}}
        >
            <Typography align="center">
                <Box sx={style} >
                    <Alert variant="filled" severity="warning">
                        <Typography variant="body1" >Delete the Top 5 {name} List ?</Typography>
                    </Alert>
                    <Typography id="empty-line-deletion-modal" mt={2}></Typography>
                    <Stack Stack direction="row" spacing={2} justifyContent="center">
                        <Button 
                        variant="contained"
                        onClick = {handleConfirm}
                        >
                            Confirm
                        </Button>

                        <Button 
                        variant="contained"
                        onClick = {handleCancel}
                        >
                            Cancel
                        </Button>
                    </Stack>
                </Box>
            </Typography>
        </Modal>
    )
}