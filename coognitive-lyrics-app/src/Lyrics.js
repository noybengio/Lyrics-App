import React, { useEffect, useState } from 'react'
import FavoriteIcon from '@material-ui/icons/Favorite';
import FontSizeChanger from 'react-font-size-changer';
import { TextField, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
    buttonStyle: {
        background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
        border: 0,
        borderRadius: 3,
        boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
        color: 'white',
        height: 48,
        padding: '0 30px',
    },
    inputStyle: {
        width: '80%',
        marginBottom: '10px',
        margin: '25px'


    },
    formStyle: {
        display:'flex',
        justifyContent: 'center',
        flexDirection: 'column',
        width: '80%',
        marginBottom: '10px',
        margin: '25px',
        position: 'relative'

    }

});

export default function Lyrics(props) {

    const classes = useStyles();

    const [songTitle, setSongTitle] = useState(props.song.songTitle || '');
    const [artist, setArtist] = useState(props.song.artist || '');
    const [lyrics, setLyrics] = useState("");

    useEffect(() => {
        console.log('component updated!')
        setLyrics(props.lyrics);
    }, [props.lyrics]);

    const onChangeSongTitle = (e) => {
        setSongTitle(e.target.value);

    }

    const onChangeArtist = (e) => {
        setArtist(e.target.value);
    }

    const onAddToFavoritesClicked = () => {
        props.onAddToFavoritesClicked();
    }

    const onSearchClicked = (e) => {
        props.onSearchClicked(songTitle, artist);
    }

    const isSearchEnabled = songTitle.length > 0 && artist.length > 0;

    return (
        <div>
                <div >
                    <div className={classes.inputStyle}>
                        <TextField
                            label="Song"
                            color="primary"
                            variant="outlined"
                            onChange={onChangeSongTitle}
                            required
                            value={songTitle}

                        />
                    </div>
                    <div className={classes.inputStyle}>
                        <TextField
                            label="Artist"
                            color="primary"
                            variant="outlined"
                            onChange={onChangeArtist}
                            required
                            value={artist}
                        />
                    </div>
                    <div className={classes.inputStyle}>
                        <Button
                            variant="outlined"
                            onClick={() => onSearchClicked()}
                            disabled={!isSearchEnabled}
                            className={classes.buttonStyle}
                        >Search</Button>
                    </div>

                </div>

                <div>
                    <div className={classes.formStyle} >
                        {lyrics &&
                            <FontSizeChanger className={classes.inputStyle}
                                targets={['#target .content']}
                                onChange={(element, newValue, oldValue) => {
                                    console.log(element, newValue, oldValue);
                                }}
                                options={{
                                    stepSize: 2,
                                    range: 3
                                }}
                                customButtons={{
                                    up: <span style={{ 'fontSize': '36px' }}>+</span>,
                                    down: <span style={{ 'fontSize': '20px' }}>-</span>,
                                    style: {
                                        backgroundColor: 'red',
                                        color: 'white',
                                        WebkitBoxSizing: 'border-box',
                                        WebkitBorderRadius: '5px',
                                        width: '60px'
                                    },
                                    buttonsMargin: 10
                                }}
                            />
                        }
                        {lyrics &&
                            <div className={classes.inputStyle}>
                                <FavoriteIcon onClick={() => onAddToFavoritesClicked()}></FavoriteIcon>
                            </div>
                        }
                    </div>
                </div>
                <div id="target">
                    <p className="content">{lyrics}</p>
                </div>
        </div>
    )

}
