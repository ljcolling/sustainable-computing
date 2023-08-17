import Document from "next/document";
import Head from "next/head";
import { ReactNode, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";


import ReactMarkdown from "react-markdown";
import rehypeRaw from 'rehype-raw';

import code_of_conduct from "../text/code_of_conduct.md";
import introduction from "../text/introduction.md";
import programme from "../text/programme.md";
import registration from "../text/registration.md";
import travel from "../text/travel.md";
import tagline from "../text/tagline.md";

/* import schedule from "../text/programme.json"; */

/* import { BiChevronUp } from "react-icons/bi"; */
import {BsChevronUp} from "react-icons/bs"
import {AiOutlineMenu} from "react-icons/ai"
type row = {
    start: string;
    finish: string;
    type_of: string;
    title: string;
    person: string;
    affiliation: string;
}

const parsetime = (t: string) => {
  t = t.split(" ")[0] + "T" + t.split(" ")[1] + "Z";
  let event = new Date(t)
  return event.toLocaleTimeString('en-UK').slice(0, 5)
}



const Markdown = ({ children, id }: { children: string, id: string }) => {
  return (
    <div id={id} className="prose prose-base mx-auto">
      <ReactMarkdown
        rehypePlugins={[rehypeRaw]}>
        {children}
      </ReactMarkdown>
    </div>
  );
};

const SubPage = ({ text, id, children }: { text: string, id: string, children?: ReactNode }) => {
  return (
    <div className="pt-8">
      <Markdown id={id}>
        {text}
      </Markdown>
      {children}
      <p className="pb-5"><button onClick={() => document.body.scrollIntoView()}><span className="text-xs text-gray-500 flex underline underline-offset-2"><BsChevronUp />Return to top</span></button></p>
    </div>
  )
}


const Row = ({ data }: { data: row }) => {
  //let i = 0;
  let this_type: string = data.type_of
  let start = parsetime(data.start)
  let finish = parsetime(data.finish)
  let timeslot = start + "–" + finish

  if (this_type === "section") {
    return <tr><td className="font-bold bg-green-500" colSpan={2}>
      <span className="p-2">{data.title}</span>
    </td></tr>
  }
  if (this_type === "talk") {
    return <tr>
      <td className="w-32"><span className="p-2 align-middle">{timeslot}</span></td>
      <td>
        <div className="px-1">
        <span className="font-bold">{data.title}</span><br />
        <span className="font-bold">{data.person}</span>, <span className="italic">{data.affiliation} </span>
        </div>
      </td>
    </tr>
  }
  if (this_type === "break") {
    return <tr>
      <td className="bg-gray-300 w-32"><span className="p-2 align-middle">{timeslot}</span></td>
      <td className="bg-gray-300">{data.title}</td>
    </tr>
  }

  if (this_type === "discussion") {
    return <tr>
      <td className="w-32"><span className="p-2 align-middle">{timeslot}</span></td>
      <td>
        {data.title}
      </td>
    </tr>
  }

  return <></>
}



const Calendar = () => {
  const [schedule, setSchedule] = useState<any>()
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    async function getdata(){
      let data = await fetch("https://docs.google.com/spreadsheets/d/e/2PACX-1vSGQerGa8JQxAj-a-I1vJz-SMLAmpsfqwp36My4vMqVxVzhpLP2t7pPyA1SMUQXB7Ebh7i7guxYCF_0/pub?output=tsv");
      let d = await data.text()
      let s = d.split("\r\n")
        .map((l: string) => l.split("\t"))
        .slice(1)
        .map((x) => {
          return {
            start: x[0],
            finish: x[1],
            type_of: x[2],
            title: x[3],
            person: x[4],
            affiliation: x[5]
          }
        })
      setSchedule(s)
      setLoaded(true)
    }
    getdata()
    console.log(schedule)
  }, [loaded])


  return (
    <div className="container">
      <table className="mx-auto max-w-screen-md" cellPadding="5px" cellSpacing="5px">
        <thead className="font-bold">
          <tr><td>Time</td><td>Activity</td></tr>
        </thead>
        <tbody>
          {
            !!!loaded ? null :
            schedule.map((data: row, index: number) => <Row data={data} key={index} />)
          }
        </tbody>
      </table>
    </div>
  )

}

function Navbar() {
  const [isNavExpanded, setIsNavExpanded] = useState(false)

  return (
    <nav id="nav" className="flex flex-col md:justify-end w-full bg-zinc-200">
      <span className="mx-auto"><button
        className="md:hidden text-zinc-800 py-5"
        onClick={() => {
          setIsNavExpanded(!isNavExpanded)
        }}
      >
        <AiOutlineMenu />
      </button>
      </span>
      <div
        className={
          isNavExpanded ? "navigation-menu expanded" : "navigation-menu"
        }
      >
        <ul className="navbar">
          <li className="menu-item"><a onClick={() => {setIsNavExpanded(!isNavExpanded)}} href="#about" >About</a></li>
          <li className="menu-item"><a onClick={() => setIsNavExpanded(!isNavExpanded)} href="#programme">Programme</a></li>
          <li className="menu-item"><a onClick={() => setIsNavExpanded(!isNavExpanded)} href="#registration">Registration</a></li>
          <li className="menu-item"><a onClick={() => setIsNavExpanded(!isNavExpanded)} href="#travel">Travel</a></li>
          <li className="menu-item"><a onClick={() => setIsNavExpanded(!isNavExpanded)} href="#code_of_conduct">Code of Conduct</a></li>
        </ul>
      </div>
    </nav>
  );
}

export default function Home() {
  return (
    <>
      <Head>
        <title>Sustainable computing workshop</title>
        <meta name="description" content="Sustainable computing for the life and health sciences" />
      </Head>
      <div className="flex min-h-screen flex-col justify-top mx-auto bg-gray-200 drop-shadow-lg backdrop-blur-lg">
        <header className="bg-cover max-w-7xl mx-auto w-full backdrop-filter" style={{ backgroundImage: `url("hero_new.jpeg")`, backgroundPosition: `center` }}>
          <div className="text-slate-50 bg-transparent backdrop-blur backdrop-filter-xl"> 
          <h1 className="text-5xl px-10 pt-16 pb-16 font-bold">
            Environmental impacts of computing in health & life sciences research
          </h1>
          <div className="pb-30 px-10">
            <p className="pb-5 text-2xl font-bold">
              Are you a life sciences researcher who uses computing in your work?<br />
              Are you concerned about the carbon footprint of your research?
            </p>
            <p className="pb-5 text-2xl font-bold">
              Join us for a free workshop on Green Research Computing for Health & Life Sciences at the prestigious Wellcome Trust in London!
            </p>
            </div>
          </div>
        </header>
        <main className="container mx-auto bg-white max-w-7xl">
        <Navbar />
          <div className="px-10 py-10">
            <article className="article">
              <SubPage text={introduction.toString()} id="about" />
              <SubPage text={programme.toString()} id="programme">
                <Calendar></Calendar>
              </SubPage>
              <SubPage text={registration.toString()} id="registration" />
              <SubPage text={travel.toString()} id="travel" />
              <SubPage text={code_of_conduct.toString()} id="code_of_conduct" />
            </article>
          </div>
        </main>
        <span className="w-full"></span>
        <footer className="md:max-w-7xl mx-auto w-full bg-white border-t-2 border-gray-100">
          <div className="prose prose-base px-5 pt-4 text-gray-500">With support from</div>
          <div className="md:grid md:grid-cols-3 px-10 pb-10 flex flex-col md:gap-1 gap-5 mx-auto items-center">
            <div className="mx-auto"><img className="logo" src="MRC.svg" /></div>
            <div className="mx-auto"><img className="logo" src="WEL.svg" /></div>
            <div className="mx-auto"><img className="logo" src="SSI.svg" /></div>
          </div>
        </footer>
      </div>
    </>
  );
}

