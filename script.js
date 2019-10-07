let programs = [];
let w = 0;
window.addEventListener("resize", function(){

    w = document.documentElement.clientWidth;

});

async function getAllChannels()
{
    try {
        const url = "http://api.sr.se/api/v2/channels?format=json&pagination=false";
        const data = await fetch(url);
        const channels = (await data.json()).channels;
        //console.table(channels);
        printChannels(channels);
    } catch (error) {
        document.getElementsByClassName("content")[0].innerHTML = "no data";
    }
}


function printChannels(channels){

    let html = channels.map(channel=>{

        return `
            <div onclick = getPrograms(this,${channel.id})>
                <h5>${channel.name}</h5>
                <img src = "${channel.image}">
            </div>
        `;

    });

    document.getElementsByClassName("content")[0].innerHTML=html.join("");
}


async function getPrograms(channel,id)
{
    if(w<700){
        document.getElementsByClassName("content")[0].innerHTML = "";
        document.getElementsByClassName("content")[0].append(channel);

    }

    try {
        const url = `http://api.sr.se/api/v2/programs/index?channelid=${id}&format=json&pagination=false`;
        const data = await fetch(url);
        programs = (await data.json()).programs;
        //console.table(programs);
        printPrograms(programs);
    } catch (error) {
        document.getElementsByClassName("content")[1].innerHTML = "no data";
    }

}


function searchPrograms(seek){
    console.log(seek.value);
    let result = programs.filter(el=> el.name.toLowerCase().search( seek.value.toLowerCase())>-1)
    console.log(result);
    if(result.length>0)printPrograms(result)
    else printPrograms(programs);
}

function printPrograms(prog){


    let html = prog.map(program=>{
        return `
            <div onclick = "getPodFiles(${program.id})">
                <h5>${program.name}</h5>
                <p>${program.description}</p>
            </div>
        `;

    });

    document.getElementsByClassName("content")[1].children[1].innerHTML= html.join("");


}

async function nextPage(url)
{
    window.scrollTo(0, 0);
   console.log(url);
    try {
        const data = await fetch(url);
        const podFiles = await data.json();
        let files = podFiles.podfiles;
        let nextUrl = podFiles.pagination.nextpage;
        printPodFiles(files,nextUrl);
    } catch (error) {
        document.getElementsByClassName("content")[2].innerHTML="No podFiles";
    }
}


async function getPodFiles(id)
{
    if(w<700){
    document.getElementsByClassName("content")[1].children[1].innerHTML="";
    }
    document.getElementById("search").value= "";
    try {
        const url = `http://api.sr.se/api/v2/podfiles?programid=${id}&format=json`;
        const data = await fetch(url);
        const podFiles = (await data.json());
        let files = podFiles.podfiles;
        let nextPage = podFiles.pagination.nextpage;
        printPodFiles(files,nextPage);
    } catch (error) {
        document.getElementsByClassName("content")[2].innerHTML="No podFiles";
    }


}

function printPodFiles(podFiles, nextPage){
    console.log(nextPage);
    let html = podFiles.map(program=>{

        return `
            <div>        
                <h5>${program.title}</h5>
                <p>${fixDate(program.publishdateutc)}</p>
                
                <audio controls>
                    <source src="${program.url}" type="audio/mpeg">
                    Your browser does not support the audio element.
                </audio>
                <br>
                Download <a href = "${program.url}"><i class = "material-icons">file_download</a>
            </div>
        `;

    });

    let extra =  `
    <br>
    <button onclick = "nextPage('${nextPage}')">Visa fler</button>
    `;

    document.getElementsByClassName("content")[2].innerHTML=html.join("") + extra;


}




function fixDate(date){

    date = date.split("(");
    date= date[1].split(")");
    date = date[0];
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    let d = new Date(parseInt(date));
    let y = d.getFullYear();
    let m = d.getMonth()+1;
    let day = d.getDate();
    m>9 ? m = m : m = "0"+m;
    day>9 ? day = day : day = "0"+day;
    return y+"-"+m+"-"+day;
}