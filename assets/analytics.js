// GA4 Consent Management
document.addEventListener('DOMContentLoaded', function() {
  const consentBanner = document.getElementById('consentBanner');
  const consentAccept = document.getElementById('consentAccept');
  const consentReject = document.getElementById('consentReject');
  
  // Prüfe, ob bereits eine Entscheidung getroffen wurde
  const consentDecision = localStorage.getItem('ga_consent');
  const isFirstVisit = !localStorage.getItem('hasVisitedBefore');
  
  // Setze Sprachsystem für Banner
  let lang = localStorage.getItem('preferredLang') || 
             (navigator.language.toLowerCase().startsWith('de') ? 'de' : 'en');
  
  // Übersetze Banner-Inhalte
  function updateConsentTexts() {
    const consentText = document.getElementById('consentText');
    if (consentText) {
      const text = consentText.getAttribute(`data-${lang}`);
      if (text) consentText.textContent = text;
    }
    
    if (consentAccept) {
      const acceptText = consentAccept.querySelector('span');
      if (acceptText) {
        const text = acceptText.getAttribute(`data-${lang}`);
        if (text) acceptText.textContent = text;
      }
    }
    
    if (consentReject) {
      const rejectText = consentReject.querySelector('span');
      if (rejectText) {
        const text = rejectText.getAttribute(`data-${lang}`);
        if (text) rejectText.textContent = text;
      }
    }
  }
  
  // Initialisiere Banner-Texte
  updateConsentTexts();
  
  // Beobachte Sprachänderungen
  const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.attributeName === 'data-de' || mutation.attributeName === 'data-en') {
        updateConsentTexts();
      }
    });
  });
  
  // Beobachte alle Elemente mit Sprachattributen
  document.querySelectorAll('[data-de][data-en]').forEach(el => {
    observer.observe(el, { attributes: true });
  });
  
  // Zeige Banner nur beim ersten Besuch oder wenn keine Entscheidung getroffen wurde
  if ((isFirstVisit || !consentDecision) && consentBanner) {
    setTimeout(() => {
      consentBanner.style.display = 'block';
      localStorage.setItem('hasVisitedBefore', 'true');
    }, 1000);
  }
  
  // Akzeptieren-Button
  if (consentAccept) {
    consentAccept.addEventListener('click', function() {
      if (typeof gtag !== 'undefined') {
        gtag('consent', 'update', {
          'analytics_storage': 'granted',
          'ad_storage': 'denied',
          'ad_user_data': 'denied',
          'ad_personalization': 'denied'
        });
      }
      localStorage.setItem('ga_consent', 'granted');
      if (consentBanner) {
        consentBanner.style.display = 'none';
      }
    });
  }
  
  // Ablehnen-Button
  if (consentReject) {
    consentReject.addEventListener('click', function() {
      if (typeof gtag !== 'undefined') {
        gtag('consent', 'update', {
          'analytics_storage': 'denied',
          'ad_storage': 'denied',
          'ad_user_data': 'denied',
          'ad_personalization': 'denied'
        });
      }
      localStorage.setItem('ga_consent', 'denied');
      if (consentBanner) {
        consentBanner.style.display = 'none';
      }
    });
  }
  
  // Wenn bereits eine Entscheidung getroffen wurde, setze Consent entsprechend
  if (consentDecision && typeof gtag !== 'undefined') {
    if (consentDecision === 'granted') {
      gtag('consent', 'update', {
        'analytics_storage': 'granted',
        'ad_storage': 'denied',
        'ad_user_data': 'denied',
        'ad_personalization': 'denied'
      });
    } else {
      gtag('consent', 'update', {
        'analytics_storage': 'denied',
        'ad_storage': 'denied',
        'ad_user_data': 'denied',
        'ad_personalization': 'denied'
      });
    }
  }
});
