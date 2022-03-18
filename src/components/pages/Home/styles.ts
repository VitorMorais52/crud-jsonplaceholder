import styled from "styled-components";

export const Container = styled.div`
  margin: 3rem auto;
  display: flex;
  overflow: auto;
  background-color: white;

  @media (min-width: 768px) {
    width: 760px;
    height: calc(100vh - 6rem);
  }

  @media (max-width: 768px) {
    margin: 1.5rem;
  }

  .content {
    width: 100%;
  }
`;
