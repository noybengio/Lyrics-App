import React, { Component } from 'react'
import List from '@material-ui/core/List';
import IconButton from '@material-ui/core/IconButton';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import DeleteIcon from '@material-ui/icons/Delete';
import ListItem from '@material-ui/core/ListItem';

export class FavoritesList extends Component {
    constructor(props) {
        super(props);
        console.log("in FavoritesList props.user: ", props.user);
        this.state = {
            favoritesList: this.props.user.favorites
        }
    }

    onDeleteFavorite(index) {
        this.props.onDeleteFavorite(index);
    }

    onItemClicked(index) {
        this.props.onFavoriteClicked(index);
    }

    render() {
        return (
            <div>
                <List >
                    {
                        (this.props.user.favorites) && (
                            this.props.user.favorites.map((item, index) => {
                                return (
                                    <ListItem key={index} button={true} onClick={()=>this.onItemClicked(index)}>
                                        <ListItemText key={index}
                                            primary={item.artist + '-' + item.songTitle}
                                        />
                                        <ListItemSecondaryAction>
                                            <IconButton onClick={() => this.onDeleteFavorite(index)} edge="end" aria-label="delete">
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
}

export default FavoritesList
