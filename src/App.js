import Header from './Header';
import SearchItem from './SearchItem';
import AddItem from './AddItem';
import Content from './Content';
import Footer from './Footer';
import { useState, useEffect } from 'react';
function App() {
  const API_URL= ' http://localhost:3500/items';
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState('')
  const [search, setSearch] = useState('')
  const [fetchErr, setFetchErr] = useState(null)
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async ()=>{
      try{
        const response = await fetch(API_URL);
        if(!response.ok) throw Error('Did not recieve expected Data')
        const listItems = await response.json();
        setItems(listItems);
        setFetchErr(null);
      }catch(err){
        setFetchErr(err.message)
      } finally{
        setIsLoading(false);
      }
    }
    setTimeout(()=>{
    (async () => await fetchItems())();
  }, 2000)
},[])



  const addItem = (item) => {
    const id = items.length ? items[items.length - 1].id + 1 : 1;
    const myNewItem = { id, checked: false, item };
    const listItems = [...items, myNewItem];
    setItems(listItems);
  }

  const handleCheck = (id) => {
    const listItems = items.map((item) => item.id === id ? { ...item, checked: !item.checked } : item);
    setItems(listItems);
  }

  const handleDelete = (id) => {
    const listItems = items.filter((item) => item.id !== id);
    setItems(listItems);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newItem) return;
    addItem(newItem);
    setNewItem('');
  }
  return (
    <div className="App">
      <Header title="Groceries"/>
      <AddItem 
      newItem={newItem}
      setNewItem={setNewItem}
      handleSubmit={handleSubmit}/>
      <SearchItem 
      search={search}
      setSearch={setSearch}/>
      <main>
        {isLoading && <p>Loading Items...</p>}
        {fetchErr && <p style={{color:"red"}}>{`Error: ${fetchErr}`}</p>}
      {!fetchErr && !isLoading && <Content 
       items={items.filter(item=>((item.item).toLowerCase()).includes(search.toLowerCase()))}
      handleDelete={handleDelete}
      handleCheck={handleCheck}
     
      />}
      </main>
      <Footer length={items.length}/>
    </div>
  );
}

export default App;
