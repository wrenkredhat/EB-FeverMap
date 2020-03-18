import { LitElement, html } from 'lit-element';
import Translator from '../util/translator';

class LanguageController extends LitElement {
    static get properties() {
        return {
            visible: { type: Boolean },
        };
    }

    constructor() {
        super();
        this.setLang();
        this.visible = true;
    }

    firstUpdated(_changedProperties) {
        document.body.addEventListener('scroll', () => {
            this.visible = document.body.scrollTop <= 0;
        });
    }

    setLang() {
        let setLangInStorage = localStorage.getItem('USER_SET_LANG');
        let lang = setLangInStorage ? setLangInStorage : navigator.language;
        if (lang.includes('-')) {
            lang = lang.split('-')[0];
        }
        if (
            !Translator.getPossibleLanguages()
                .map(lang => lang.key)
                .includes(lang)
        ) {
            console.error(`Lang ${lang} not found. Defaulting to English.`);
            lang = 'en';
        }
        Translator.getPossibleLanguages();
        Translator.setLang(lang);
        localStorage.setItem('USER_SET_LANG', lang);
    }

    handleLanguageChange(e) {
        let selectedLang = e.target.value;
        localStorage.setItem('USER_SET_LANG', selectedLang);
        Translator.setLang(selectedLang);
        window.location.reload();
    }

    render() {
        return html`
            <div class="language-switcher${this.visible ? '' : ' language-switcher--hidden'}">
                <p>${Translator.get('language')}</p>
                <select id="language-selector" @change="${this.handleLanguageChange}"
                    ><option value="${Translator.getLang().key}">${Translator.getLang().name}</option>
                    ${Translator.getPossibleLanguages().map(lang => {
                        if (lang.key === Translator.lang) {
                            return;
                        }
                        return html`
                            <option value="${lang.key}">${lang.name}</option>
                        `;
                    })}</select
                >
            </div>
        `;
    }

    createRenderRoot() {
        return this;
    }
}

if (!customElements.get('language-controller')) {
    customElements.define('language-controller', LanguageController);
}