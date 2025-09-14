/*
const YOUTUBE_PLAYLIST_ITEMS_API = "https://www.googleapis.com/youtube/v3/playlistItems";

export default function YouTube( { data } ) {
  return (
  <ul>
    {data.items.map(({ id, snippet = {} }) => {
      const { title, thumbnails = {}, resourceId = {} } = snippet;
     const { medium } = thumbnails;
     return (
       <li key={id} className={styles.card}>
         <a href={`https://www.youtube.com/watch?v=${resourceId.videoId}`}>
           <p>
             <img width={medium.width} height={medium.height} src={medium.url} alt="" />
           </p>
           <h3>{ title }</h3>
          </a>
        </li>
      )
    })}
  </ul>
  ); 
}
*/
