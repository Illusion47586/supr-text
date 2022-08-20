import { PrismTheme } from 'prism-react-renderer';
import theme from 'prism-react-renderer/themes/vsDark';

const editorTheme: PrismTheme = {
    plain: {
        ...theme.plain,
        fontSize: 16,
        fontFamily: "'JetBrains Mono', sans-serif",
        backgroundColor: 'transparent',
    },
    styles: [...theme.styles],
};

export default editorTheme;
