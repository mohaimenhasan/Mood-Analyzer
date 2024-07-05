// src/components/TopArtistsTable.tsx
import React from 'react';

interface Artist {
    name: string;
    genres: string[];
    popularity: number;
}

interface TopArtistsTableProps {
    artists: Artist[];
}

const TopArtistsTable: React.FC<TopArtistsTableProps> = ({ artists }) => {
    return (
        <table className="top-artists-table">
            <thead>
                <tr>
                    <th>Artist</th>
                    <th>Genres</th>
                    <th>Popularity</th>
                </tr>
            </thead>
            <tbody>
                {artists.map(artist => (
                    <tr key={artist.name}>
                        <td>{artist.name}</td>
                        <td>{artist.genres.join(', ')}</td>
                        <td>{artist.popularity}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default TopArtistsTable;
