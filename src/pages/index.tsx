import Head from "next/head";
import Image from "next/image";
import { Dispatch, ReactNode, SetStateAction, useEffect, useState } from "react";


import ReactMarkdown from "react-markdown";
import rehypeRaw from 'rehype-raw';

import code_of_conduct from "../text/code_of_conduct.md";
import introduction from "../text/introduction.md";
import programme from "../text/programme.md";
import registration from "../text/registration.md";
import travel from "../text/travel.md";
import who from "../text/who.md";

/* import schedule from "../text/programme.json"; */

/* import { BiChevronUp } from "react-icons/bi"; */
import { AiOutlineMenu } from "react-icons/ai";
import { BsChevronUp } from "react-icons/bs";



const parsetime = (t?: string) => {

  if (t == undefined) {
    return ""
  }
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

const ReturnButton = () => {
return <button onClick={() => document.body.scrollIntoView()}><span className="text-xs text-gray-500 flex underline underline-offset-2"><BsChevronUp />Return to top</span></button>
}

const SubPage = ({ text, id, children }: { text: string, id: string, children?: ReactNode }) => {
  return (
    <div className="pt-8">
      <Markdown id={id}>
        {text}
      </Markdown>
      {children}
      <p className="pb-1"><ReturnButton /></p>
    </div>
  )
}


const CalenderRow = ({ data }: { data: Row }) => {

  const start = parsetime(data.start)
  const finish = parsetime(data.finish)
  const timeslot = start + "–" + finish
  
  if (data.type_of === "section") {
    return <tr>
      <td className="font-bold bg-green-500 w-32"> <span className="p-2">{timeslot}</span></td>
      <td className="font-bold bg-green-500"> <span className="">{data.title}</span></td>
    </tr>

  }
  if (data.type_of === "talk") {
    return <tr>
      <td colSpan={2}>
        <div className="px-4">
          <span className="font-bold">{data.title}</span><br />
          <span className="font-bold">{data.person}</span>, <span className="italic">{data.affiliation} </span>
        </div>
      </td>
    </tr>
  }
  if (data.type_of === "break") {
    return <tr>
      <td className="bg-gray-300 w-32"><span className="p-2 align-middle">{timeslot}</span></td>
      <td className="bg-gray-300">{data.title}</td>
    </tr>
  }

  if (data.type_of === "discussion") {
    return <tr>
      <td colSpan={2}>
        <div className="px-4">{data.title}</div>
      </td>
    </tr>
  }

  return <></>
}

type Row = {
  start?: string,
  finish?: string,
  type_of?: string,
  title?: string,
  person?: string,
  affiliation?: string

}


const useCalendarData = () => {

  const [schedule, setSchedule] = useState<Row[]>()
  const [loaded, setLoaded] = useState<boolean>(false);

  useEffect(() => {
    async function getdata() {
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


      const finish_cells = [...s.map((v, i) => v.type_of === "break" ? i - 1 : 0).filter((v) => v != 0), s.length - 1]
      const finish_times = finish_cells.map(i => s.at(i)?.finish)
      const sections = s.map((v, i) => v.type_of === "section" ? i + 1 : 0).filter((v) => v).map((v) => v - 1)
      let index = 0;
      s.map((v, i) => {
        if (sections.includes(i)) {
          v.finish = finish_times[index]
          index = index + 1;
          return v
        }
        return v
      })
      setSchedule(s)
      setLoaded(true)

    }
    getdata()

  }, [loaded])

  return { loaded, schedule }
}

const Calendar = () => {

  const { loaded, schedule } = useCalendarData();

  return (
    <div className="container">
      <table className="mx-auto max-w-screen-md" cellPadding="5px" cellSpacing="5px">
        <thead className="font-bold">
        </thead>
        <tbody>
          {
            !!!loaded ? <p className="p-5 font-bold">Loading schedule...</p> :
              schedule?.map((data: Row, index: number) =>
                <CalenderRow data={data} key={index} />)
          }
        </tbody>
      </table>
    </div>
  )

}

function Navbar({ isNavExpanded, setIsNavExpanded }: { isNavExpanded: boolean, setIsNavExpanded: Dispatch<SetStateAction<boolean>> }) {
  /* const [isNavExpanded, setIsNavExpanded] = useState(false) */

  return (
    <nav id="nav" className="flex flex-col md:justify-end w-full bg-zinc-100">
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
          <li className="menu-item"><a onClick={() => { setIsNavExpanded(!isNavExpanded) }} href="#about" >About</a></li>
          <li className="menu-item"><a onClick={() => setIsNavExpanded(!isNavExpanded)} href="#who">Who is it for?</a></li>
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

  const [isNavExpanded, setIsNavExpanded] = useState<boolean>(false)
  return (
    <>
      <Head>
        <title>Sustainable computing workshop</title>
        <meta name="description" content="Sustainable computing for the life and health sciences" />
      </Head>
      <div className="flex min-h-screen flex-col justify-top mx-auto drop-shadow-lg backdrop-blur-lg">
        <header className="bg-cover max-w-7xl mx-auto w-full backdrop-filter" style={{ backgroundImage: `url("hero_new.jpeg")`, backgroundPosition: `center` }}>
          <div className="text-slate-50 bg-transparent backdrop-blur backdrop-filter-xl">
            <h1 className="text-5xl px-10 pt-16 pb-16 font-bold">
              Environmental impacts of computing in health & life sciences research
            </h1>
            <div className="pb-30 px-10">
              <p className="pb-5 text-2xl font-bold">
                Are you a health or life sciences researcher who uses computing in your work?<br />
                Are you concerned about the carbon footprint of your research?
              </p>
              <p className="pb-5 text-2xl font-bold">
                Join us for a free workshop on Greener Research Computing for Health &
                Life Sciences at the Wellcome Trust in London
              </p>
            </div>
          </div>
        </header>
        <main className="container mx-auto bg-white max-w-7xl">
          <Navbar isNavExpanded={isNavExpanded} setIsNavExpanded={setIsNavExpanded} />
          <div className="px-10 py-10">
            <article className={`article`} >
              {/* <article className={`article ${isNavExpanded ? "blur" : ""}`} > */}
              <SubPage text={introduction.toString()} id="about" />
              <SubPage text={who.toString()} id="who" />
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
            <div className="mx-auto"><Image alt="MRC Logo" className="logo" src="MRC.svg" width="220" height="100" /></div>
            <div className="mx-auto"><Image alt="Wellcome Logo" className="logo" src="WEL.svg" width="220" height="100" /></div>
            <div className="mx-auto"><Image alt="Software Sustainability Institute Logo" width="220" height="100" className="logo" src="SSI.svg" /></div>
          </div>
        </footer>
      </div>
    </>
  );
}

