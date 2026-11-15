import Link from "next/link";

export default function NotFound() {
  return (
    <>
      <h1 className="hero-title">Hittade inte receptet</h1>
      <p className="lede">Det kanske har bytt namn. Gå tillbaka till listan.</p>
      <div className="actions">
        <Link className="cta" href="/">
          Alla recept
        </Link>
      </div>
    </>
  );
}
