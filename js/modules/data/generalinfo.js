export const generalInfo = {
  head: {
    title: {ru:'Главная - Святослав Задерий и Группа НАТЕ!',
            en:'Home - Sviatoslav Zaderyi and Band NATE!'},
    meta: {
      description: {ru:'Святослав Задерий и Группа НАТЕ! - Музыка для взрослых - Официальный сайт',
                    en:'Sviatoslav Zaderyi and Band NATE! - Music for adults - Official website'},
      keywords: {ru:'Святослав Задерий, Группа НАТЕ!, рок-группа, музыка, ленинградский рок, русский рок',
                 en:'Sviatoslav Zaderyi, Band NATE!, rock band, music, leininград rock, russian rock'},
      ogImage: 'img/og.webp',
      ogUrl: 'https://gruppanate.com/',
      canonical: 'https://gruppanate.com/'
    },
    favicon: 'img/favicon.ico',
    styles: [
      { type: 'text/css', href: 'css/slick.css' },
      { href: 'css/variables.css' },
      { href: 'css/base.css' },
      { href: 'css/components.css' },
      { href: 'css/layout.css' },
      { href: 'css/animations.css' },
      { href: 'css/responsive.css' },
      { href: 'css/custom.css' }
    ],
    googleTag: {
      src: 'https://www.googletagmanager.com/gtag/js?id=G-PGFWWX9CHN',
      config: `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-PGFWWX9CHN');
        gtag('config','AW-11151945413');
      `,
      conversionContent: `
        function gtag_report_conversion_content(url) {
          var callback = function () {
            if (typeof(url) != 'undefined') {
              window.location = url;
            }
          };
          gtag('event', 'conversion', {
            'send_to': 'AW-11151945413/McszCPuL1a4YEMXd1MUp',
            'event_callback': callback
          });
          return false;
        }
      `,
      conversionExt: `
        function gtag_report_conversion_ext(url) {
          var callback = function () {
            if (typeof(url) != 'undefined') {
              window.location = url;
            }
          };
          gtag('event', 'conversion', {
            'send_to': 'AW-11151945413/jXsNCP6L1a4YEMXd1MUp',
            'event_callback': callback
          });
          return false;
        }
      `
    },
    yandexMetrika: `
      (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
      m[i].l=1*new Date();
      for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
      k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
      (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");
      ym(93604819, "init", {
        clickmap:true,
        trackLinks:true,
        accurateTrackBounce:true,
        webvisor:true
      });
    `,
    yandexNoscript: `<div><img src="https://mc.yandex.ru/watch/93604819" style="position:absolute; left:-9999px;" alt="" /></div>`
  },
  logo: { ru:'img/svg/hero-title-ru.svg', 
          en:'img/svg/hero-title-en.svg' },
  textBlock2: {ru:'Советский рок – неотъемлемая часть мировой культуры. В нём были выкрикнуты надежды и чаяния нескольких поколений жителей советского и постсоветского пространства, их мировоззрение, боль и мечты. Среди тех, кто создавал музыку и слова, отразившие эпоху конца Союза, есть немало имён незаслуженно забытых, затерянных во времени, но не потерявших своей значимости.',
               en:'Soviet rock is an integral part of world culture. It screamed out hopes and aspirations several generations of residents of the Soviet and post-Soviet space,their worldview, pain and dreams. Among those who created music and words that reflected the era of the end of the Soviet Union, there are many undeserved names forgotten, lost in time, but did not lost their significance.'},
  textBlock1: {ru:`<a href="https://ru.wikipedia.org/wiki/Задерий,_Святослав_Геннадьевич" target="_blank" style="color: #FCFCFC;">Святослав Задерий</a> стоял у истоков русского рока. Он основал группы <a href="https://ru.wikipedia.org/wiki/Алиса_(группа)" target="_blank" style="color: #FCFCFC;">“АЛИСА”</a> и <a href="https://ru.wikipedia.org/wiki/Нате!_(группа)" target="_blank" style="color: #FCFCFC;">“НАТЕ!”</a>. Его песни гремели по всему Союзу в конце 80-х и начале 90-х годов, а его неуёмная энергия вдохновляла соратников и поклонников на собственные свершения. Он напрямую способствовал становлению <a href="https://ru.wikipedia.org/wiki/Кинчев,_Константин_Евгеньевич" target="_blank" style="color: #FCFCFC;">Константина Кинчева</a>, <a href="https://ru.wikipedia.org/wiki/Башлачёв,_Александр_Николаевич" target="_blank" style="color: #FCFCFC;">Александра Башлачёва</a>, русского рока в целом. И хотя его путь оборвался, голос его по-прежнему звучит где-то в лабиринтах нашего культурного кода. Настало время включить его на полную громкость.`,
               en:`<a href="https://ru.wikipedia.org/wiki/Задерий,_Святослав_Геннадьевич" target="_blank" style="color: #FCFCFC;"><b>Svyatoslav Zaderij</b></a> stood at the origins of Russian rock. He founded bands <a href="https://en.wikipedia.org/wiki/Alisa_(Russian_band)" target="_blank" style="color: #FCFCFC;"><b>“Alisa”</b></a> and <a href="https://ru.wikipedia.org/wiki/Нате!_(группа)" target="_blank" style="color: #FCFCFC;"><b>“Nate!”</b></a>. His songs thundered throughout the Soviet Union in the late 80s and early 90s, and his indefatigable energy inspired his comrades-in-arms and fans to their own achievements. He directly contributed to the <a href="https://en.wikipedia.org/wiki/Konstantin_Kinchev" target="_blank" style="color: #FCFCFC;"><b>Konstantin Kinchev's</b></a> development, <a href="https://en.wikipedia.org/wiki/Alexander_Bashlachev" target="_blank" style="color: #FCFCFC;"><b>Alexander Bashlachev's</b></a>, and whole russian-rock in general. Although his life path was cut short, his voice still sounds somewhere in the labyrinths of russian cultural code. It's time to turn it up at full volume.`},
  textAlbumIntro: {ru:['<a href="about.html" style="color: #FCFCFC;" target="_blank">Альбом “Музыка для взрослых”</a> – это путешествие во времени и лучшее подтверждение того, что русский рок никогда не был вторичным.',
    'Голос Святослава Задерия вновь слышен, благодаря музыкантам нескольких поколений: более <b>50 инструменталистов и 12 певцов, участников таких групп, как Алиса, Нате, Аквариум, Кино, Зоопарк, ДДТ, Аукцыон, Странные Игры, АВИА, Сплин и многих других.</b>'
  ],
               en:['<a href="about_en.html" style="color: #FCFCFC;" target="_blank"><b>Album “Music for adults”</b></a> – it is time travel and the best proof that Russian rock has never been derivative.', 
    'The voice of Svyatoslav Zaderiy can be heard again, thanks to the musicians of several generations: more than 50 instrumentalists and 12 singers, members of such bands as Alisa, Nate!, Aquarium, Kino, Zoopark, DDT, Auktyon, Strannye Igry, AVIA, Splean and many others.'
  ]},
  textAlbumInfo: {ru:['<b>Концептуальный альбом, герменевтическое исследование советского и русского рока - это памятник Святославу Задерию, утверждение его ценностей</b>',
    'Песни, написанные Славой в разные годы, по-прежнему звучат актуально и во многом отражают действительность.',
    'Cтановление современной России перемололо стремления и идеи целого поколения, и его представителей, и откинуло нас в прошлое. Значит пришло время вернуться к истокам и выяснить в чем мы ошиблись.', 
    '<b>Альбом составлен как цельное произведение с последовательным повествованием, поэтому его стоит слушать по порядку от начала до конца</b>'],
    en:['<b>Conceptual album, hermeneutic study of Soviet and Russian rock - this is a monument to Svyatoslav Zaderiy and an affirmation of his values</b>',
    'The songs, written by Zaderij at different times, still sound relevant and largely reflect reality.',
    'The formation of modern Russia has crushed the aspirations and ideals of an entire generation and its representatives, throwing us back into the past. This means it is time to return to the origins and understand where we turned wrong.',
    '<b>The album is composed as a whole work with sequential narration, so it should be listened to in order from beginning to end</b>'
  ]},
  sliderItems: [
    {
      image: 'img/slider.webp',
      alt: '',
      text: {ru:'Святослав Задерий собирает "Нате!" в 1987. Название предложил Кинчев. Музыканты меняются но сохраняется дух проекта: манифестация свободы, фьюжн в музыке, секс-энд-ролл на сцене. "Свобода – это призрак открытой двери за твоей спиной. Приятно осознавать, что дверь не заперта, и ты можешь спокойно жить, не пользуясь дверными ручками".',
             en:'Svyatoslav Zaderij founded “Nate!” in 1987. The name was suggested by Kinchev. Musicians have changed, but the spirit of the project has been preserved: a manifestation of freedom, fusion in music, sex-and-roll on stage. "Freedom is the ghost of an open door behind you. It\'s nice to know that the door is not locked, and you can calmly live without using doorknobs".'},
      title: {ru:'Начало',
             en:'Beginning'},
      year: '1987'
    },
    {
      image: 'img/slider2.webp',
      alt: '',
      text: {ru:'Проект формирует собственную вселенную. Задерий добивается наилучшего звука и из каждого концерта делает театрализованное шоу. Всесоюзные гастроли. Записаны два главных альбома. "Важно петь о жизни, а жизнь - она сама по себе социальна. Из жизни должна исходить политика, а не из политики складываться жизнь".',
             en:'The project creates its own universe. Zaderij achieves the best sound and from each concert he makes a theatrical show. All-Union tours. Two main albums were recorded. "It is important to sing about life, and life is itself social. Life should generate politics, not politics generate life".'},
      title: {ru:'Успех. "Не бойся", "Этология"',
             en:'Success. "Don\'t be afraid", "Etotology"'},
      year: '1989'
    },
    {
      image: 'img/slider3.webp',
      alt: '',
      text: {ru:'Развал СССР. "Нате!" расползается вслед за страной. Святослав работает с Игорем Ганькевичем, но тот неожиданно умирает и группа закрывается. После этого Задерий записывает концептуальный альбом, спродюсированный Петром Мамоновым, но почти не выступает, надолго пропадая из медиа поля.',
             en:'The collapse of the USSR. “Nate!” spreads out with the country. Svyatoslav works with Igor Ganchik, but he unexpectedly dies and the group closes. After this, Zaderij records a conceptual album, produced by Peter Mamonov, but almost does not perform, long disappearing from the media field.'},
      title: {ru:'Полураспад. "Гамбринус", "Джазус Крест"',
             en:'Half-collapse. "Gambrinus", "Jazzus Cross"'},
      year: '1991'
    },
    {
      image: 'img/slider4.webp',
      alt: '',
      text: {ru:'После длительного молчания Задерий дает мощное шоу на рок-фестивале Театра DDT. Работает с несколькими группами, записывает материал, оттачивает мастерство. Он снова красноречив и полон идей, но его художественный мир слишком не похож на новую реальность. Потребуется всего 20 лет, чтобы они вновь сошлись.',
             en:'After a long silence, Zaderij gives a powerful show at the DDT Theater on the rock festival. He works with several groups, records material, and perfects his skills. He is once again eloquent and full of ideas, but his artistic world is too different from the new reality. It will take only 20 years for them to come together.'},
      title: {ru:'Возвращение. "Нате!", "Магна Матер", "Rock-n-Roll city"',
             en:'Return. "Nate!", "Magnamater", "Rock-n-Roll city"'},
      year: '1997'
    },
    {
      image: 'img/slider5.webp',
      alt: '',
      text: {ru: 'Бинго рок-звезды: яркая личная жизнь, вещества, бесконечные гастроли. Но в России рокеры сгорают не по западной схеме, а медленно и некрасиво. В этот период Слава занимался музыкой ушедших друзей, в частности Башлачева. "Творческому человеку необходимо двигаться, летать, отрываться от земли. Иначе — крах".',
             en: 'Rock star bingo: colorful personal life, drug problems, endless touring. But in Russia rockers burn not according to the Western scheme, but slowly and ugly. During this period, Slava was engaged by the music of dead friends, in particular Bashlachev. “A creative person needs to move, fly off the ground. Otherwise he collapses".'},
      title: {ru:'Память. "Семь кругов беспокойного лада"',
              en:'Memory. "Seven circles of anxious harmony"'},
      year: '2003'
    },
    {
      image: 'img/slider6.webp',
      alt: '',
      text: {ru:'Через десять лет после своей смерти петербургский рок-герой Святослав Задерий выпускает новый альбом. Его слова звучат до боли знакомо, его музыка прямолинейна, многослойна и слегка небрежна, ему аккомпанируют давние соратники. Это голос из прошлого, напоминающий нам, живущим сейчас, о том, откуда мы идем и почему мы ушли оттуда. Легенды превращаются в историю на наших глазах.',
             en:'Ten years after his death, the St. Petersburg rock hero Svyatoslav Zaderiy releases a new album. His words sound painfully familiar, his music is straight-forward, multi-layered, and slightly careless, and he is accompanied by long-time comrades. This is the voice of the past, reminding us, living now, where we came from and why we left there. Legends turn into history on our eyes.'},
      title: {ru:'И снова. "Музыка для взрослых"',
              en:'Again. "Music for adults"'},
      year: '2023'
    }
  ],
  footer: {
    titleSvg: {ru:
       { file: 'img/svg/footer-title-ru.svg' },
      en: { file: 'img/svg/footer-title-en.svg' }
    },
    buttons: [
      {
        platform: 'Spotify',
        url: 'https://open.spotify.com/artist/1CHvDyvTP45UHjjAPnpvCV',
        label: 'SpotifyFoo',
        file: 'img/svg/spotify.svg'
      },
      {
        platform: 'Yandex Music',
        url: 'https://music.yandex.ru/artist/15977367/',
        label: 'YandexFoo',
        file: 'img/svg/yandex.svg'
      },
      {
        platform: 'YouTube',
        url: 'https://www.youtube.com/@gruppanate',
        label: 'YoutubeFoo',
        file: 'img/svg/youtube.svg'
      },
      {
        platform: 'Twitter',
        url: 'https://twitter.com/SZaderiy',
        label: 'TwitterFoo',
        file: 'img/svg/twitter.svg'
      },
      {
        platform: 'Instagram',
        url: 'https://www.instagram.com/gruppanate/',
        label: 'IgramFoo',
        file: 'img/svg/instagram.svg'
      }
    ],
    email: 'gruppanate@gmail.com',
    phone: '+917822054627',
    navButtons: {
      current: { ru: 'Актуальное', en: 'Current' },
      archive: { ru: 'Архив', en: 'Archive' },
      remasters: { ru: 'Переиздания', en: 'Remasters' }
    },
    lyricsButtons: {
      show: { ru: 'смотреть текст', en: 'show lyrics' },
      hide: { ru: 'скрыть текст', en: 'hide lyrics' }
    }
  }
};
