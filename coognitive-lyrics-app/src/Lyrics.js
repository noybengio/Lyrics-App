import React, { Component } from 'react'
import StarIcon from '@material-ui/icons/Star';
import FontSizeChanger from 'react-font-size-changer';

export default class Lyrics extends Component {
    constructor(props) {
        super(props);

        this.onChangeSongTitle = this.onChangeSongTitle.bind(this);
        this.onChangeArtist = this.onChangeArtist.bind(this);
        this.onAddToFavoritesClicked = this.onAddToFavoritesClicked.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

        this.state = {
            songTitle: this.props.song.songTitle,
            artist: this.props.song.artist,
            lyrics: props.lyrics
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.lyrics !== prevProps.lyrics) {
          this.setState({lyrics:this.props.lyrics })
        }
      }

    onChangeSongTitle(e) {
        this.setState({
            songTitle: e.target.value
        })
    }

    onChangeArtist(e) {
        this.setState({
            artist: e.target.value
        })
    }

    onAddToFavoritesClicked() {
       this.props.onAddToFavoritesClicked()
    }

    onSubmit(e) {
        e.preventDefault();
        this.props.onSearchClicked(this.state.songTitle, this.state.artist);
    }

    render() {
        return (
            <div>
                <h3>Search For Lyrics</h3>
                <form onSubmit={this.onSubmit}>
                    <div className="form-group">
                        <label>Song Title: </label>
                        <input type="text"
                            required
                            className="form-control"
                            value={this.state.songTitle}
                            onChange={this.onChangeSongTitle}
                        />
                    </div>
                    <div className="form-group">
                        <label>Artist: </label>
                        <input type="text"
                            required
                            className="form-control"
                            value={this.state.artist}
                            onChange={this.onChangeArtist}
                        />
                    </div>
                    <div className="form-group">
                        <input type="submit" value="search" className="btn btn-primary" />
                    </div>
                    {this.state.lyrics &&
                        <div className="form-group">
                            <StarIcon onClick={() => this.onAddToFavoritesClicked()}></StarIcon>
                        </div>
                    }
                </form>

                <div>
                    {this.state.lyrics &&
                        <FontSizeChanger
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
                    <div id="target">
                        <p className="content">{this.state.lyrics} </p>

                    </div>
                </div>
            </div>
        )
    }
}
