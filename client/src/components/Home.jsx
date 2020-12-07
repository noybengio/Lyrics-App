import React, { useState } from 'react'
import { Tabs, Tab, AppBar } from "@material-ui/core";
import Lyrics from './Lyrics'
import FavoritesList from './FavoritesList'
import axios from 'axios';
import Alert from '@material-ui/lab/Alert';
import Snackbar from '@material-ui/core/Snackbar';

export default function Home(props) {

    const [selectedTab, setSelectedTab] = useState(props.selectedTab ? props.selectedTab : 0);
    const [songToDisplay, setSongToDisplay] = useState('');
    const [lyrics, setLyrics] = useState("");
    const [user, setUser] = useState(props.user);
    const [status, setStatusBase] = useState(null);
    const [openSnackBar, setOpenSnackBar] = useState(false);


    const handleChange = (event, newValue) => {
        setSelectedTab(newValue);
    };

    const onDeleteFavorite = (index) => {
        let newFavorites = user.favorites;
        newFavorites.splice(index, 1);
        let updatdUser = {
            username: user.username,
            password: user.password,
            favorites: newFavorites,
            id: user._id
        }

        //add to favorites in db
        axios.post('/update', updatdUser)
            .then(res => {
                console.log("lyrics update req: ", res.data)
            });
        setUser(updatdUser);
    }

    const fetchLyrics = (lyricsDetails) => {
        axios.get('/lyrics', {
            params: lyricsDetails
        })
            .then(res => {
                if (Object.keys(res.data).length === 0) {
                    setLyrics(null);
                    setStatusBase("Lyrics Not Found");
                    setOpenSnackBar(true);
                } else {
                    setLyrics(res.data);
                }
            }).catch(error => {
                setStatusBase(error);
                setOpenSnackBar(true);

            });
    }

    const onFavoriteClicked = (index) => {
        setSelectedTab(0);
        const songToDisplay = props.user.favorites[index];
        setSongToDisplay(songToDisplay);
        fetchLyrics(songToDisplay);
    }

    const onSearchClicked = (songTitle, artist) => {
        const songToDisplay = { songTitle: songTitle, artist: artist };
        setSongToDisplay(songToDisplay);
        fetchLyrics(songToDisplay);
    }

    const findSong = (favorites, newSong) => {
        const found = favorites.find(element => element.songTitle === newSong.songTitle);
        return found;
    }

    const onAddToFavoritesClicked = () => {
        const favoriteSong = {
            songTitle: songToDisplay.songTitle,
            artist: songToDisplay.artist,
        }
        let newFavorites = props.user.favorites;
        let foundSong = findSong(newFavorites, favoriteSong);
        if (foundSong) {
            setStatusBase("Song Already In Favorites");
            setOpenSnackBar(true);

        }
        else {
            newFavorites.push(favoriteSong);
            let updatdUser = {
                username: props.user.username,
                password: props.user.password,
                favorites: newFavorites,
                id: props.user._id
            }
            // add to favorites in db
            axios.post('/update', updatdUser)
                .then(res => {
                    setStatusBase("Song Added To Favorites");
                    setOpenSnackBar(true);
                }).catch(error => {
                    setStatusBase(error);
                    setOpenSnackBar(true);
                })
        }
    }

    return (
        <>
            <AppBar position="static">
                <Tabs value={selectedTab} onChange={handleChange} selectionFollowsFocus >
                    <Tab label="Lyrics" />
                    <Tab label="Favorites" />
                </Tabs>
            </AppBar>

            <Snackbar open={openSnackBar} autoHideDuration={3000} onClose={() => setOpenSnackBar(false)}>
                <Alert color="info" variant="filled">{status}</Alert>
            </Snackbar>

            {
                selectedTab === 0 && <Lyrics lyrics={lyrics}
                    user={props.user}
                    song={songToDisplay}
                    onAddToFavoritesClicked={onAddToFavoritesClicked}
                    onSearchClicked={onSearchClicked}
                />
            }
            {
                selectedTab === 1 && <FavoritesList user={props.user}
                    onFavoriteClicked={onFavoriteClicked}
                    onDeleteFavorite={onDeleteFavorite}
                />
            }
        </>

    )
}


