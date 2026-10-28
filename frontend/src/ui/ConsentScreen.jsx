import { useState } from 'react';

function ConsentScreen({ onAccept }) {
  const [checked, setChecked] = useState(false);

  return (
    <section>
      <h2>Katılım Onayı</h2>
      <p>
        Bu çalışma, problem çözerken nasıl davrandığınızı (yazma, silme,
        duraklama gibi) inceleyerek bir "bilişsel imza" oluşturmayı amaçlar.
      </p>
      <ul>
        <li>Adınız, e-postanız veya IP adresiniz kaydedilmez; size rastgele bir kimlik atanır.</li>
        <li>Sadece görev alanındaki tuş, silme, tıklama ve süre bilgileri toplanır.</li>
        <li>Veriler yalnızca akademik amaçla kullanılır.</li>
        <li>İstediğiniz zaman çalışmadan ayrılabilirsiniz.</li>
      </ul>
      <label>
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => setChecked(e.target.checked)}
        />
        Bilgilendirmeyi okudum ve katılmayı kabul ediyorum.
      </label>
      <br />
      <button disabled={!checked} onClick={onAccept}>
        Başla
      </button>
    </section>
  );
}

export default ConsentScreen;