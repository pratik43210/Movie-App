import SECRET_KEY from "./apikey.js";

/** Links */

const API_KEY="api_key="+SECRET_KEY;
const Base_URL="https://api.themoviedb.org/3";
const img_URL="https://image.tmdb.org/t/p/w500";
const API_URL=Base_URL+"/discover/movie?sort_by=popularity.desc&"+API_KEY;
const Search_URL=Base_URL+"/search/movie?"+API_KEY;

/** Elements */
const movContainer=document.querySelector('#mov-container');
const form=document.querySelector('.s-el');
const search=document.querySelector('#search');
const prev=document.querySelectorAll('.prev');
const next=document.querySelectorAll('.next');
const curr=document.querySelectorAll('.current');
const homeEl=document.querySelector('.home');
const results=document.querySelector('.results');
const formGt=document.querySelector('.gotoPN');
const pgSearch=document.querySelector('#targetPg');
const currPN=document.querySelector('#current');
const tagsEl=document.querySelector('#tags');
const MovieIcon=document.querySelector('.brand-title');

let currURL='';
let searchMovURL='';
let resultNo='';
let avlPg='';
let jumpPgURL='';
let genreSearchURL='';
let currentPgn=1;
let selectedGenre=[];
let imgSrc='';
const defaultImg="../img/dflt.jpg";

const genre=[
    {
      "id": 28,
      "name": "Action"
    },
    {
      "id": 12,
      "name": "Adventure"
    },
    {
      "id": 16,
      "name": "Animation"
    },
    {
      "id": 35,
      "name": "Comedy"
    },
    {
      "id": 80,
      "name": "Crime"
    },
    {
      "id": 99,
      "name": "Documentary"
    },
    {
      "id": 18,
      "name": "Drama"
    },
    {
      "id": 10751,
      "name": "Family"
    },
    {
      "id": 14,
      "name": "Fantasy"
    },
    {
      "id": 36,
      "name": "History"
    },
    {
      "id": 27,
      "name": "Horror"
    },
    {
      "id": 10402,
      "name": "Music"
    },
    {
      "id": 9648,
      "name": "Mystery"
    },
    {
      "id": 10749,
      "name": "Romance"
    },
    {
      "id": 878,
      "name": "Science Fiction"
    },
    {
      "id": 10770,
      "name": "TV Movie"
    },
    {
      "id": 53,
      "name": "Thriller"
    },
    {
      "id": 10752,
      "name": "War"
    },
    {
      "id": 37,
      "name": "Western"
    }
];

/**Get Generes */


const getGenre=()=>{
    tagsEl.innerHTML=`<div class="tag clear flex-centered">Clear</div>`;
    const clear=document.querySelector('.clear');
    /**Clear Genere */
    clear.addEventListener('click', ()=>{
        clearHighlight();
        goToHome();
    });

    const activeTags=document.querySelectorAll('.active-genre');
    activeTags.forEach(el=>el.classList.remove('active-genre'));

    genre.forEach(tag=>{
        const t=document.createElement('div');
        t.classList.add('tag','flex-centered');
        t.id=tag.id;
        t.innerText=tag.name;

        t.addEventListener('click',async ()=>{
            if(selectedGenre.length==0){
                selectedGenre.push(tag.id);
            }else{
                if(selectedGenre.includes(tag.id)){
                    selectedGenre.forEach((id,index)=>{
                        if(id==tag.id){
                            selectedGenre.splice(index,1);
                            t.classList.remove('active-genre');
                        }
                    })
                }else{
                    selectedGenre.push(tag.id);
                }
            }
            highlight();
            genreSearchURL=API_URL+'&with_genres='+selectedGenre.join(',');
            if(selectedGenre.length!=0){
                const resGenre= await MovieList(genreSearchURL);
                curr.forEach(el=>el.innerText=1);
                prev.forEach(el=>el.classList.add('muted'));
                homeEl.classList.remove('hide');
                results.innerHTML=`
                    <h4>${resGenre.total_results} results found (${resGenre.total_pages} pages)</h4>
                `;
            }else{
                goToHome();
            }
        })

        tagsEl.append(t);
    })
};

const highlight=()=>{
    if(selectedGenre.length!=0){
            selectedGenre.forEach(id=>{
            const highlightedTag=document.getElementById(id);
            highlightedTag.classList.add('active-genre');
        })
    }
};

const clearHighlight=()=>{
    if(selectedGenre.length!=0){
            selectedGenre.forEach(id=>{
            const highlightedTag=document.getElementById(id);
            highlightedTag.classList.remove('active-genre');
        })
    }
    selectedGenre=[];
};

getGenre();

/**Rendering the movies */
const MovieList= async (url)=>{
    const res=await fetch(url);
    const data=await res.json();

    // console.log(data);
    DisplayAll(data.results);
    avlPg=data.total_pages;
    currURL=url;
    return data
}

MovieList(API_URL);

const DisplayAll=data=>{
    movContainer.innerHTML='';

    data.forEach(movie => {
        const {title, poster_path, vote_average, overview, adult}=movie;
        if(poster_path){
            imgSrc=img_URL+poster_path;
        }else{
            imgSrc=defaultImg;
        }
        const movieEl=document.createElement('div');
        movieEl.classList.add('mov-card', 'flex', 'pointer');
        movieEl.innerHTML=`<img src="${imgSrc}" alt="${title}" class="mov-img">
        <div class="info flex">
            <h1 class="title flex">${title}</h1>
            <div class="rating flex bold ${getColour(vote_average)}">${vote_average}</div>
        </div>
        <div class="desc bitter">
        <p style="font-weight:700; margin:5px 0">Overview:</p>
            ${overview}
        </div>`

        movContainer.appendChild(movieEl);
    });
}

const getColour= (rating)=>{
    if(rating>=7.5) return 'green';

    else if(rating>=6) return 'yellow';

    else return 'red';
};

/**Pagination */

const NextPg=async (pgNo=1)=>{
    if(currentPgn<avlPg){
        if (currURL==API_URL || currURL==searchMovURL || currURL==genreSearchURL){
            pgNo++;
            currURL=currURL+'&page='+pgNo;
            await MovieList(currURL);
        }
        else{
            pgNo++;
            currURL=currURL.replace(`page=${+pgNo-1}`,`page=${pgNo}`);
            await MovieList(currURL);
        }
    
        if(pgNo==2){
            prev.forEach(el=>el.classList.remove('muted'));
            homeEl.classList.remove('hide');
        }
    
        currentPgn=pgNo;
        curr.forEach(el=>el.innerText=currentPgn);
    }
};

next.forEach(el=>{
    el.addEventListener('click', ()=>{
        NextPg(currPN.innerText);
    });
});

const PrevPg=async (pgNo=2)=>{
    pgNo--;
    currURL=currURL.replace(`page=${+pgNo+1}`,`page=${pgNo}`)
    await MovieList(currURL);

    if(pgNo==1){
        prev.forEach(el=>el.classList.add('muted'));
    }

    if(currURL==(API_URL+'&page=1')){
        homeEl.classList.add('hide');
    }

    currentPgn=pgNo;
    curr.forEach(el=>el.innerText=currentPgn);
};

prev.forEach(el=>{
    el.addEventListener('click',()=>{
        if(currPN.innerText>1){
            PrevPg(currPN.innerText);
        }
    });
});

/**Pagination end */

/**Search Feature */

form.addEventListener('submit', async (e)=>{
    e.preventDefault();
    clearHighlight();

    const searchMov=search.value;

    if(searchMov){
        searchMovURL=Search_URL+'&query='+searchMov;
        const dataRes= await MovieList(searchMovURL);

        results.innerHTML=`
            <h4 class="bitter italic">Search returned ${dataRes.total_results} results  ( ${dataRes.total_pages} pages )  for ${searchMov}:</h4>
        `;
        curr.forEach(el=>el.innerText=1);
        prev.forEach(el=>el.classList.add('muted'));
    }

    search.value='';
    homeEl.classList.remove('hide');
});

/**Go to homepage */
const goToHome=()=>{
    MovieList(API_URL);
    homeEl.classList.add('hide');
    results.innerHTML='';
    search.value='';
    curr.forEach(el=>el.innerText=1);
    prev.forEach(el=>el.classList.add('muted'));
    clearHighlight();
}
homeEl.addEventListener('click', ()=>{
    goToHome();
});
MovieIcon.addEventListener('click', ()=>{
    goToHome();
});

/**Go to page */
formGt.addEventListener('submit',async (e)=>{
    e.preventDefault();
    const jumpToPg=pgSearch.value;
    try{
        if(jumpToPg<=avlPg){
            if (currURL==API_URL || currURL==searchMovURL || currURL==genreSearchURL){
                jumpPgURL=currURL+'&page='+jumpToPg;
            }else{
                jumpPgURL=currURL.replace(`page=${currentPgn}`,`page=${jumpToPg}`);
            }
            currentPgn=jumpToPg;
            curr.forEach(el=>el.innerText=jumpToPg);
            await MovieList(jumpPgURL);
            if(jumpToPg>1){
                prev.forEach(el=>el.classList.remove('muted'));
                homeEl.classList.remove('hide');
            }else{
                prev.forEach(el=>el.classList.add('muted'))
            }
        }else{
            throw new Error('Page does not exist');
        }
    }catch(e){
        alert(e);
    }finally{
        pgSearch.value='';
    }
});

/**Open/close collapsable section */
const dropCont=document.querySelector('.drop-container');
const dropIcon=document.querySelector('.drop');
const dropEl=document.querySelector('.genre');
let flag=0;

dropCont.addEventListener('click',()=>{
    if(flag==0){
        dropEl.classList.add('expand');
        dropEl.classList.remove('reduce');
        dropIcon.classList.add('flip');
        flag=1;
    }
    else {
        dropEl.classList.remove('expand');
        dropEl.classList.add('reduce');
        dropIcon.classList.remove('flip');
        flag=0;
    }
})



/**Scroll */
const scrollHandler=()=>{
    return window.scrollTo(0,0);
}