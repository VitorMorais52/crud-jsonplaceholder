import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
    :root {
    }

    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }

    html {
        @media (max-width: 1080px) {
            font-size: 93.75%;
        }

        @media (max-width: 720px) {
            font-size: 87.5%;
            
        }
    }

    body {
        background: rgb(174,196,238);
        background: linear-gradient(90deg, rgba(174,196,238,0.6194852941176471) 0%, rgba(148,187,233,1) 100%);
        -webkit-font-smoothing: antialiased;
    }

    body, input, button, textarea {
        font-family: 'Poppins', sans-serif;
        font-weight: 400;
    }

    h1, h2, h3, h4, h5, h6, strong {
        font-weight: 600;
    }
`;
