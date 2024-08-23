export const Home = () => {
  return (
    <section >
      <video
        autoPlay
        loop
        muted
        className="fixed min-w-full min-h-full max-w-none top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 "
      >
        <source src="/Blomdanser.mp4" type="video/mp4" />
      </video>
    </section>
  );
};
