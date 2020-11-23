import React, { useState } from 'react'
import { Tabs, Tab, AppBar } from "@material-ui/core";
import Lyrics from './Lyrics'
import FavoritesList from './FavoritesList'
import axios from 'axios';

export default function Home(props) {

    const [selectedTab, setSelectedTab] = useState(props.selectedTab ? props.selectedTab : 0);
    const [songToDisplay, setSongToDisplay] = useState('');
    const [lyrics, setLyrics] = useState("");
    const [user, setUser] = useState(props.user);

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
        axios.post('http://localhost:4000/update', updatdUser)
            .then(res => {
                console.log("lyrics update req: ", res.data)
            });

        setUser(updatdUser);
    }

    const fetchLyrics = (lyricsDetails) => {
        axios.get('http://localhost:4000/lyrics', {
            params: lyricsDetails
        })
            .then(res => {
                if (Object.keys(res.data).length === 0) {
                    setLyrics(null);
                    window.alert("Lyrics Not Found");
                } else {
                    setLyrics(res.data);
                }
            }).catch(error => {
                console.log("error ", error);
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

    const onAddToFavoritesClicked = () => {
        const favoriteSong = {
            songTitle: songToDisplay.songTitle,
            artist: songToDisplay.artist,
        }
        let newFavorites = props.user.favorites;
        newFavorites.push(favoriteSong);
        let updatdUser = {
            username: props.user.username,
            password: props.user.password,
            favorites: newFavorites,
            id: props.user._id
        }
        // add to favorites in db
        axios.post('http://localhost:4000/update', updatdUser)
            .then(res => {
                window.alert("Song Added To Favorites");
                console.log("lyrics update req: ", res.data);
            }).catch(error => {
                console.log("lyrics update req: ", error);
                window.alert("error adding song to favorites");
            })
}

    return (
        <>
            <AppBar position="static">
                <Tabs value={selectedTab} onChange={handleChange} selectionFollowsFocus >
                    <Tab label="Lyrics" />
                    <Tab label="Favorites" />
                </Tabs>
            </AppBar>

            { selectedTab === 0 && <Lyrics lyrics={lyrics}
                user={props.user}
                song={songToDisplay}
                onAddToFavoritesClicked={onAddToFavoritesClicked}
                onSearchClicked={onSearchClicked}
            />}
            { selectedTab === 1 && <FavoritesList user={props.user}
                onFavoriteClicked={onFavoriteClicked}
                onDeleteFavorite={onDeleteFavorite}
            />}
        </>

    )
}


