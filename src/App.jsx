import { useEffect, useState } from "react";

function shuffleArray(array) {
  const newArray = [...array]; 
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
   return newArray;
}

export default function App(){
  const [items, setItems] = useState([]);
  const [clicked, setClicked] = useState([]);      
  const [bestScore, setBestScore] = useState(0);   


  useEffect(() => {
    async function load() {
      const res = await fetch(
        "https://api.artic.edu/api/v1/artworks?limit=20&fields=id,title,image_id"
      );
      const data = await res.json();
 
      setItems(shuffleArray(data.data.filter(x => x.image_id)));

    }
   
    load();

  }, []);

   function handleImageClick(id) {
    if (clicked.includes(id)) {
      setBestScore(prev => Math.max(prev, clicked.length));
      setClicked([]);

      setItems(prevItems => shuffleArray(prevItems)); 
    } else {
      setClicked(prev => [...prev, id]);

      setItems(prevItems => shuffleArray(prevItems)); 
    }
  }



  return(
    <div id="game">
      <h1>Memory</h1>
      <p>Best score: {bestScore}</p>
      <p>Current unique clicks: {clicked.length}</p>

      <div
      id="imgs"
      >
        {items.map((item) => (
          <div
          onClick={() => handleImageClick(item.id)}
          >
            <img 
              src={`https://www.artic.edu/iiif/2/${item.image_id}/full/400,/0/default.jpg`}
              alt={item.title}
              styles ={{
              width: "100%",
              objectFit: "cover",
              display: "block"
            }}
            ></img>
            <p>{item.title}</p>
          </div>
        ))}
      </div>
    </div>
  )
}