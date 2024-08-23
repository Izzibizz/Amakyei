export const Home = () => {
  return (
    <section >
      <video
        autoPlay
        loop
        muted
        playsInline
        className="fixed top-1/2 left-1/2 w-screen h-screen object-cover transform -translate-x-1/2 -translate-y-1/2"
      >
        <source src="/Blomdanser.mp4" type="video/mp4" />
      </video>
    </section>
  );
};
