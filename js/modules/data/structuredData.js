/**
 * Structured Data (JSON-LD) for SEO and AI Search Optimization
 * This data is used to generate schema.org markup for search engines
 */

import { generateAudioObjects } from '../utils/audioObjectSchema.js';

// Generate AudioObject schemas for tracks
const audioObjects = generateAudioObjects();

export const structuredData = {
	"@context": "https://schema.org",
	"@graph": [
		{
			"@type": "MusicGroup",
			"@id": "https://gruppanate.com/#musicgroup",
			"name": "Группа НАТЕ!",
			"alternateName": "Group NATE!",
			"url": "https://gruppanate.com",
			"image": "https://gruppanate.com/img/og.webp",
			"description": "Святослав Задерий и Группа НАТЕ! - Музыка для взрослых - Официальный сайт. Легендарная ленинградская рок-группа, основанная в 1987 году. Альбомы: Не бойся (1987), Этология (1989), Музыка для взрослых (2023).",
			"foundingDate": "1987",
			"foundingLocation": {
				"@type": "Place",
				"name": "Ленинград",
				"alternateName": "Leningrad, Saint Petersburg",
				"address": {
					"@type": "PostalAddress",
					"addressLocality": "Ленинград",
					"addressRegion": "Ленинградская область",
					"addressCountry": "СССР"
				}
			},
			"genre": ["Русский рок", "Ленинградский рок", "Russian Rock", "Leningrad Rock", "Советский рок"],
			"knowsAbout": ["Советский рок", "Ленинградский рок", "Русский рок 80-х", "Концептуальная музыка", "Рок-музыка СССР"],
			"award": "Легенда ленинградского рока",
			"founder": {
				"@type": "Person",
				"name": "Святослав Задерий",
				"alternateName": "Svyatoslav Zaderiy"
			},
			"sameAs": [
				"https://open.spotify.com/artist/1CHvDyvTP45UHjjAPnpvCV",
				"https://music.yandex.ru/artist/15977367/",
				"https://www.youtube.com/@gruppanate",
				"https://twitter.com/SZaderiy",
				"https://www.instagram.com/gruppanate/"
			]
		},
		{
			"@type": "Person",
			"name": "Святослав Задерий",
			"alternateName": "Svyatoslav Zaderiy",
			"jobTitle": "Музыкант, Основатель групп АЛИСА и НАТЕ!",
			"description": "Основатель групп Алиса и НАТЕ!, стоял у истоков ленинградского рока",
			"birthDate": "1955",
			"deathDate": "2013",
			"birthPlace": {
				"@type": "Place",
				"name": "Ленинград"
			},
			"alumniOf": {
				"@type": "Organization",
				"name": "Ленинградская рок-сцена"
			},
			"sameAs": [
				"https://ru.wikipedia.org/wiki/Задерий,_Святослав_Геннадьевич"
			]
		},
		{
			"@type": "MusicAlbum",
			"name": "Музыка для взрослых",
			"alternateName": "Music for adults",
			"description": "Концептуальный альбом, герменевтическое исследование советского и русского рока. Памятник Святославу Задерию, записанный с участием более 50 музыкантов из различных известных рок-групп: Алиса, Аквариум, Кино, ДДТ, Аукцыон, Странные Игры и других. Альбом состоит из 13 треков и разделен на две части: Сторона А - о человеке и государстве, Сторона Б - о любви.",
			"datePublished": "2023-01-01",
			"inLanguage": ["ru", "en"],
			"keywords": "русский рок, ленинградский рок, Святослав Задерий, концептуальный альбом, Музыка для взрослых, советский рок",
			"numberOfTracks": 13,
			"byArtist": {
				"@type": "MusicGroup",
				"name": "Группа НАТЕ!"
			},
			"albumReleaseType": "https://schema.org/AlbumRelease",
			"numTracks": 13
		},
		{
			"@type": "MusicAlbum",
			"name": "Не бойся",
			"alternateName": "Don't be afraid",
			"description": "Легендарный альбом Группы НАТЕ!",
			"datePublished": "1987",
			"byArtist": {
				"@type": "MusicGroup",
				"name": "Группа НАТЕ!"
			},
			"albumReleaseType": "https://schema.org/AlbumRelease"
		},
		{
			"@type": "MusicAlbum",
			"name": "Этология",
			"alternateName": "Ethology",
			"description": "Альбом Группы НАТЕ!",
			"datePublished": "1989",
			"byArtist": {
				"@type": "MusicGroup",
				"name": "Группа НАТЕ!"
			},
			"albumReleaseType": "https://schema.org/AlbumRelease"
		},
		{
			"@type": "BreadcrumbList",
			"itemListElement": [
				{
					"@type": "ListItem",
					"position": 1,
					"name": "Главная",
					"item": "https://gruppanate.com/"
				},
				{
					"@type": "ListItem",
					"position": 2,
					"name": "О проекте",
					"item": "https://gruppanate.com/about.html"
				}
			]
		},
		{
			"@type": "FAQPage",
			"mainEntity": [
				{
					"@type": "Question",
					"name": "Кто такой Святослав Задерий?",
					"acceptedAnswer": {
						"@type": "Answer",
						"text": "Святослав Задерий - основатель групп Алиса и НАТЕ!, стоял у истоков ленинградского рока. Он основал группу Алиса, а затем группу НАТЕ! в 1987 году. Его песни гремели по всему Советскому Союзу в конце 80-х и начале 90-х годов."
					}
				},
				{
					"@type": "Question",
					"name": "Когда была основана группа НАТЕ?",
					"acceptedAnswer": {
						"@type": "Answer",
						"text": "Группа НАТЕ! была основана Святославом Задерием в 1987 году. Название группы предложил Константин Кинчев."
					}
				},
				{
					"@type": "Question",
					"name": "Какие альбомы выпустила группа НАТЕ?",
					"acceptedAnswer": {
						"@type": "Answer",
						"text": "Группа НАТЕ! выпустила несколько альбомов, включая 'Не бойся' (1987), 'Этология' (1989), и концептуальный альбом 'Музыка для взрослых' (2023), который был записан через 10 лет после смерти Святослава Задерия."
					}
				},
				{
					"@type": "Question",
					"name": "Что такое альбом 'Музыка для взрослых'?",
					"acceptedAnswer": {
						"@type": "Answer",
						"text": "'Музыка для взрослых' - это концептуальный альбом 2023 года, герменевтическое исследование советского и русского рока. Это памятник Святославу Задерию, записанный с участием более 50 инструменталистов и 12 певцов из таких групп как Алиса, Нате, Аквариум, Кино, Зоопарк, ДДТ, Аукцыон и других."
					}
				},
				{
					"@type": "Question",
					"name": "Где можно послушать музыку группы НАТЕ?",
					"acceptedAnswer": {
						"@type": "Answer",
						"text": "Музыку группы НАТЕ! можно послушать на Spotify, Yandex Music, YouTube, а также на официальном сайте gruppanate.com. Альбом 'Музыка для взрослых' доступен на всех основных музыкальных платформах."
					}
				},
				{
					"@type": "Question",
					"name": "Какие группы основал Святослав Задерий?",
					"acceptedAnswer": {
						"@type": "Answer",
						"text": "Святослав Задерий основал две известные рок-группы: 'Алиса' и 'НАТЕ!'. Он также способствовал становлению таких музыкантов как Константин Кинчев и Александр Башлачёв."
					}
				}
			]
		},
		// Add AudioObject schemas for individual tracks
		...audioObjects
	]
};

