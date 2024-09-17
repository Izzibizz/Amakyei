import blue from "../assets/Ama.jpg";
import green from "../assets/Ama-kyei-dancer.jpg";
import { useParams } from "react-router-dom";

export const About = () => {
  const { position } = useParams();
  console.log(position);

  return (
    <section className="text-main-dark w-full flex flex-col laptop:w-10/12 laptop:m-auto animate-fadeIn">
      <h3 className="text-2xl font-heading text-right mb-10">About</h3>
      {/* Mobile */}
      <div className="flex flex-col gap-12 tablet:hidden">
        <video
          src="https://res.cloudinary.com/dbf8xygxz/video/upload/v1726561289/about_Ama-kyei-wanda.mp4"
          alt="about video"
          className="w-full rounded-xl"
          autoPlay
          muted
          loop
          controls
        />
        <p className="font-heading">
          Im a Finnish- Ghanaian dancer, dance teacher, choreographer and doula.{" "}
        </p>

        <p className="font-body">
          I looove groove, flow, music and presence also known as dance. Besides
          my passion for dance I love nature, children, colors and community. My
          heart burns for creating for and with children and youth. Id love to
          see a world where <span className="font-semibold">children</span> and{" "}
          <span className="font-semibold">youth</span> got to grow up being in
          their superpowers.
        </p>
        <div className="bg-main-white w-full p-6 rounded-xl border border-green">
          <h4 className="font-heading mb-4">Education</h4>
          <ul className="flex flex-col gap-4 font-body">
            <li>
              <span className="font-semibold">Dancer</span>
              <br />
              Åsa folkhögskola (2014-2016)
            </li>
            <li>
              <span className="font-semibold">
                Bachelors in dance pedagogy <br />
              </span>
              University of Arts in Stockholm (2017-2020)
            </li>

            <li>
              <span className="font-semibold">
                Traditional West African dances <br />
              </span>
              Ecoles des Sables, Senegal (2019)
            </li>
          </ul>
        </div>
        <p className="text-justify font-body">
          Besides these official studies Ive studied contemporary and modern
          West- African dances in Ghana and Benin. My doula education I did in
          Cape Coast, Ghana at A life of peace- school (2022).
          <br />
          I've been teaching dance since 2010 and my passion for teaching stems
          from my desire to both be and to create environments free from worrie,
          where self expression is the goal and joy is garanteed.
        </p>
      </div>
      {/* tablet */}
      <div className="hidden tablet:flex laptop:hidden">
        <div className="flex flex-col w-1/2 gap-8 pr-4">
          <p className="font-heading text-sm font-semibold self-end text-right mb-4 w-3/4">
            Im a Finnish- Ghanaian dancer, dance teacher, choreographer and
            doula.{" "}
          </p>
          <p className="font-body text-justify">
            I looove groove, flow, music and presence also known as dance.
            Besides my passion for dance I love nature, children, colors and
            community. My heart burns for creating for and with children and
            youth. Id love to see a world where{" "}
            <span className="font-semibold">children</span> and{" "}
            <span className="font-semibold">youth</span> got to grow up being in
            their superpowers.
          </p>
          <img src={green} className="w-full rounded-xl" />
          <p className="text-justify font-body">
            Besides these official studies Ive studied contemporary and modern
            West- African dances in Ghana and Benin. My doula education I did in
            Cape Coast, Ghana at A life of peace- school (2022).
            <br />
            I've been teaching dance since 2010 and my passion for teaching
            stems from my desire to both be and to create environments free from
            worrie, where self expression is the goal and joy is garanteed.
          </p>
        </div>
        <div className="flex flex-col w-1/2 pl-4 gap-8">
          <img src={blue} className="w-full rounded-xl" />
          <div className="bg-main-white w-11/12 p-6 rounded-xl border border-green">
            <h4 className="font-heading mb-4">Education</h4>
            <ul className="flex flex-col gap-4 font-body">
              <li>
                <span className="font-semibold">Streetdance</span>
                <br />
                Åsa folkhögskola (2014-2016)
              </li>
              <li>
                <span className="font-semibold">
                  Bachelors in dance pedagogy <br />
                </span>
                University of Arts in Stockholm (2017-2020)
              </li>

              <li>
                <span className="font-semibold">
                  Traditional West African dances <br />
                </span>
                Ecoles des Sables, Senegal (2019)
              </li>
            </ul>
          </div>
        </div>
      </div>
      {/* Laptop */}
      <div className="hidden laptop:flex gap-20 justify-evenly">
        <div className="flex flex-col gap-8">
          <p className="font-heading text-sm font-semibold self-end text-right mb-4 w-2/4">
            Im a Finnish- Ghanaian dancer, dance teacher, choreographer and
            doula.{" "}
          </p>
          <p className="font-body text-justify self-end">
            I looove groove, flow, music and presence also known as dance.
            Besides my passion for dance I love nature, children, colors and
            community. My heart burns for creating for and with children and
            youth. Id love to see a world where{" "}
            <span className="font-semibold">children</span> and{" "}
            <span className="font-semibold">youth</span> got to grow up being in
            their superpowers.
          </p>
          <img src={green} className="w-full rounded-xl " />
        </div>
        <img src={blue} className="w-3/12 h-2/3 object-cover rounded-xl " />
        <div className="flex flex-col gap-8">
          <div className="bg-main-white p-6 rounded-xl border border-green">
            <h4 className="font-heading mb-4">Education</h4>
            <ul className="flex flex-col gap-4 font-body">
              <li>
                <span className="font-semibold">Streetdance</span>
                <br />
                Åsa folkhögskola (2014-2016)
              </li>
              <li>
                <span className="font-semibold">
                  Bachelors in dance pedagogy <br />
                </span>
                University of Arts in Stockholm (2017-2020)
              </li>

              <li>
                <span className="font-semibold">
                  Traditional West African dances <br />
                </span>
                Ecoles des Sables, Senegal (2019)
              </li>
            </ul>
          </div>
          <p className="text-justify font-body">
            Besides these official studies Ive studied contemporary and modern
            West- African dances in Ghana and Benin. My doula education I did in
            Cape Coast, Ghana at A life of peace- school (2022).
            <br />
            I've been teaching dance since 2010 and my passion for teaching
            stems from my desire to both be and to create environments free from
            worrie, where self expression is the goal and joy is garanteed.
          </p>
        </div>
      </div>
    </section>
  );
};
