import { useCallback } from 'react';
import { useApp } from '../context/AppContext';
import es from '../locales/es.json';
import en from '../locales/en.json';

const dictionaries = { es, en };

const useTranslation = () => {
  const { language } = useApp();

  const t = useCallback((key, params = {}) => {
    const dict = dictionaries[language] || dictionaries.es;
    let text = dict[key] || key;
    Object.entries(params).forEach(([k, v]) => {
      text = text.replace(`{{${k}}}`, v);
    });
    return text;
  }, [language]);

  return { t, language };
};

export default useTranslation;
