import { useEffect, useState } from "react";


function shuffleArray(array) {
  const newArray = [...array]; 
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

export default function ArtGallery() {
  const [items, setItems] = useState([]);
  const [clicked, setClicked] = useState([]);      
  const [bestScore, setBestScore] = useState(0);   

 
  useEffect(() => {
    async function load() {
      const res = await fetch(
        "https://api.artic.edu/api/v1/artworks?limit=20&fields=id,title,image_id"
      );
      const data = await res.json();

      console.log(data)
 
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


  return (
    <div>
      <h1>Art Gallery Memory Game</h1>

      <p>Current unique clicks: {clicked.length}</p>
      <p>Best score: {bestScore}</p>

      <div 
        style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", 
          gap: "1rem" 
        }}
      >
        {items.map((item) => (
          <div 
            key={item.id} 
            onClick={() => handleImageClick(item.id)}
            style={{
      
              height: "250px", 
              cursor: "pointer",
              overflow: "hidden", 
              border: "1px solid #ccc",
              borderRadius: "5px",
              display: "flex", 
              flexDirection: "column", 
              textAlign: "center"
            }}
          >
            <img
              src={`https://www.artic.edu/iiif/2/${item.image_id}/full/400,/0/default.jpg`}
              alt={item.title}
              style={{ 

                width: "100%",
              
                objectFit: "cover", 
                display: "block" 
              }}
            />
            <p style={{ margin: 0, padding: "5px 2px", fontSize: "0.85rem", flexGrow: 1 }}>
              {item.title}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}