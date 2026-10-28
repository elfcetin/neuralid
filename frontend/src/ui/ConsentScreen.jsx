import { useState } from 'react';

function ConsentScreen({ onAccept }) {
  const [checked, setChecked] = useState(false);

  return (
    <section className="consent">
      <h2>Katılım Onayı</h2>
      <p>
        Bu çalışma, problem çözerken nasıl davrandığınızı (yazma, silme,
        duraklama gibi) inceleyerek bir "bilişsel imza" oluşturmayı amaçlar.
      </p>
      <ul className="consent-list">
        <li>Adınız, e-postanız veya IP adresiniz kaydedilmez; size rastgele bir kimlik atanır.</li>
        <li>Sadece görev alanındaki tuş, silme, tıklama ve süre bilgileri toplanır.</li>
        <li>Veriler yalnızca akademik amaçla kullanılır.</li>
        <li>İstediğiniz zaman çalışmadan ayrılabilirsiniz.</li>
      </ul>
      <label className="checkbox-row" htmlFor="consent-checkbox">
        <input
          id="consent-checkbox"
          type="checkbox"
          checked={checked}
          onChange={(e) => setChecked(e.target.checked)}
        />
        <span>Bilgilendirmeyi okudum ve katılmayı kabul ediyorum.</span>
      </label>
      <button className="btn-primary" disabled={!checked} onClick={onAccept}>
        Başla
      </button>
    </section>
  );
}

export default ConsentScreen;