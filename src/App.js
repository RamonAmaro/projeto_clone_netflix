import React, { useEffect, useState } from 'react';
import './App.css';
import tmdb from './tmdb';
import MovieRow from './componentes/MovieRow'
import FeaturedMovie from './componentes/FeaturedMovie'
import Header from './componentes/header'

export default () => {

  const [movieList, setMovieList] = useState([]);
  const [featuredData, setFeaturedData] = useState(null);
  const [blackHeader, setBlackHeader] = useState(false);

    useEffect(() => {
      const loadAll = async () => {
        //pegando a lista total
        let list  = await tmdb.getHomeList();
        setMovieList(list);

        // pegando o Featured(Série ou filme que vai ficar em destaque).
        // pegamos alguma serie ou filmes da seção originals
        let originals = list.filter(i=>i.slug === 'originals' );
        // aqui vamos gerar um numero aleatorio para buscar um filme ou série de acordo com a quantidade de items no array
        let randomChosen = Math.floor(Math.random() * (originals[0].items.results.length -1))
        //vamos jogar jogar esse filme na variavel abaixar e cada vez que atualizar, vai trazer um filme aleatorio
        let chosen = originals[0].items.results[randomChosen];
        let chosenInfo = await tmdb.getMovieInfo(chosen.id, 'tv');
        setFeaturedData(chosenInfo);
      }
        loadAll();
    }, []);

    //useEffect para controlar o background do header.
    useEffect(() => {
      const scrolllistener = () => {
        if(window.scrollY > 10) {
          setBlackHeader(true);
        }
        else{
          setBlackHeader(false);
        }
      }
      window.addEventListener('scroll', scrolllistener);

      return () => {
        window.removeEventListener('scroll', scrolllistener);
      }
    }, []);

  return (
    <div className="page">

      <Header black={blackHeader}/> 

      {featuredData && 
        <FeaturedMovie item={featuredData} />
      }
      <section className="lists">
        {movieList.map((item, key) => (
          <MovieRow key={key} title={item.title} items={item.items} />
        ))}
      </section>

      <footer style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        marginBottom: '15px',
        fontFamily: 'Roboto'
      }}>
          <span> Projeto desenvolvido por RamonAmaro. </span> 
          <span> Direitos de imagens para Netflix. </span> 
          <span> Dados pegos do da API - Themoviedb.org.</span> 
      </footer>
      
      { movieList.length <= 0 &&
        <div className="loading">
          <img src="https://www.filmelier.com/pt/br/news/wp-content/uploads/2020/03/netflix-loading.gif" alt="loading"/>
        </div>
      }
      
    </div>
  )
}



