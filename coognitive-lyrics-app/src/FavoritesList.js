import React, { useState } from 'react'
import List from '@material-ui/core/List';
import IconButton from '@material-ui/core/IconButton';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import DeleteIcon from '@material-ui/icons/Delete';
import ListItem from '@material-ui/core/ListItem';

export default function FavoritesList(props) {

    const [favoritesList,setFavoritesList] = useState(props.user.favorites ||'');
   
    const onDeleteFavorite = (index)  => {
        props.onDeleteFavorite(index);
    }

    const onItemClicked = (index) => {
        props.onFavoriteClicked(index);
    }


        return (
            <div>
                <List >
                    {
                        favoritesList && (
                            favoritesList.map((item, index) => {
                                return (
                                    <ListItem key={index} button={true} onClick={()=>onItemClicked(index)}>
                                        <ListItemText key={index}
                                            primary={item.artist + '-' + item.songTitle}
                                        />
                                        <ListItemSecondaryAction>
                                            <IconButton onClick={() => onDeleteFavorite(index)} edge="end" aria-label="delete">
                                                <DeleteIcon />
                                            </IconButton>
                                        </ListItemSecondaryAction>
                                    </ListItem>
                                )
                            })
                        )
                    }

                </List>
            </div>
        )
    }


