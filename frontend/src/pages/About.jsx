import { Link } from 'react-router-dom';

export default function About() {
  return (
    <>
      <section style={{ padding: '120px var(--pad) 80px', borderBottom: '1px solid var(--line)' }}>
        <div className="mono" style={{ color: 'var(--mute)', marginBottom: 32 }}>The story · 01</div>
        <h1 className="display" style={{ fontSize: 'clamp(64px, 9vw, 180px)', margin: 0, lineHeight: 0.85 }}>
          Murals,<br/><span className="italic" style={{ fontFamily: 'var(--f-italic)', textTransform: 'none', fontWeight: 400 }}>but</span> wearable.
        </h1>
        <p style={{ maxWidth: '60ch', fontSize: 17, lineHeight: 1.6, color: 'var(--ink-soft)', marginTop: 32 }}>
          Mr.Max maluje na ścianach. Te ściany są w miastach, gdzie żadne muzeum nie chce ich pokazywać.
          Dlatego część tych ścian — w ograniczonej edycji 50 sztuk — można dziś nosić.
        </p>
        <p style={{ maxWidth: '60ch', fontSize: 17, lineHeight: 1.6, color: 'var(--ink-soft)' }}>
          Każdy drop to jeden mural, jeden krój, jedna seria. Po wyczerpaniu — koniec.
          Druk powstaje dopiero gdy złożysz zamówienie. Mniej marnotrawstwa,
          mniej nieprzewidywalności po naszej stronie, więcej numerów na metce po Twojej.
        </p>
      </section>

      <section style={{ padding: '80px var(--pad)' }}>
        <h2 className="display" style={{ fontSize: 'clamp(48px, 6vw, 96px)', margin: 0 }}>
          How it<br/><span className="italic" style={{ fontFamily: 'var(--f-italic)', textTransform: 'none', fontWeight: 400 }}>works.</span>
        </h2>
        <div className="features" style={{ marginTop: 48 }}>
          <div className="feature"><span className="num">/01</span><b>Mural<br/>found</b><p>Mr.Max namalował ścianę. Wybiera 1 z 12 do publikacji.</p></div>
          <div className="feature"><span className="num">/02</span><b>Edition<br/>opens</b><p>Drop trwa do wyczerpania 50 sztuk lub maksymalnie 30 dni.</p></div>
          <div className="feature"><span className="num">/03</span><b>You<br/>order</b><p>Wybierasz numer, rozmiar, fit. Płatność trafia do artysty.</p></div>
          <div className="feature"><span className="num">/04</span><b>Printful<br/>prints</b><p>Drukarnia w EU robi Twoją sztukę. Wysyłka w 3–5 dni.</p></div>
        </div>
      </section>

      <section style={{ padding: '80px var(--pad)', borderTop: '1px solid var(--line)', textAlign: 'center' }}>
        <Link to="/sklep" className="btn btn-fill">See current drops →</Link>
      </section>
    </>
  );
}
