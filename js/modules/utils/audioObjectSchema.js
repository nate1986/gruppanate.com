/**
 * Generates AudioObject schema for tracks
 * This helps search engines understand individual tracks
 */

import { adu1Album } from '../data/adu1Data.js';
import { adu2Album } from '../data/adu2Data.js';
import { neboysyaAlbum } from '../data/neboysyaData.js';
import { etologiaAlbum } from '../data/etologiaData.js';

/**
 * Creates AudioObject schema for a track
 */
function createAudioObject(track, albumName, albumYear, trackNumber) {
	return {
		"@type": "AudioObject",
		"name": track.title?.ru || track.title?.en || track.title,
		"description": `Песня "${track.title?.ru || track.title?.en || track.title}" из альбома "${albumName}" (${albumYear}) группы НАТЕ!`,
		"contentUrl": `https://gruppanate.com/${track.audio}`,
		"encodingFormat": "audio/mpeg",
		"duration": "PT0M0S", // Placeholder - можно добавить реальную длительность
		"inAlbum": {
			"@type": "MusicAlbum",
			"name": albumName,
			"datePublished": albumYear.toString()
		},
		"byArtist": {
			"@type": "MusicGroup",
			"name": "Группа НАТЕ!"
		},
		"position": trackNumber
	};
}

/**
 * Generates AudioObject schemas for all tracks
 */
export function generateAudioObjects() {
	const audioObjects = [];
	
	// Альбом "Музыка для взрослых" - Сторона А
	if (adu1Album && adu1Album.tracks) {
		adu1Album.tracks.forEach((track, index) => {
			audioObjects.push(createAudioObject(
				track,
				"Музыка для взрослых",
				2023,
				index + 1
			));
		});
	}
	
	// Альбом "Музыка для взрослых" - Сторона Б
	if (adu2Album && adu2Album.tracks) {
		adu2Album.tracks.forEach((track, index) => {
			audioObjects.push(createAudioObject(
				track,
				"Музыка для взрослых",
				2023,
				adu1Album.tracks.length + index + 1
			));
		});
	}
	
	// Альбом "Не бойся"
	if (neboysyaAlbum && neboysyaAlbum.tracks) {
		neboysyaAlbum.tracks.forEach((track, index) => {
			audioObjects.push(createAudioObject(
				track,
				"Не бойся",
				1987,
				index + 1
			));
		});
	}
	
	// Альбом "Этология"
	if (etologiaAlbum && etologiaAlbum.tracks) {
		etologiaAlbum.tracks.forEach((track, index) => {
			audioObjects.push(createAudioObject(
				track,
				"Этология",
				1989,
				index + 1
			));
		});
	}
	
	return audioObjects;
}


