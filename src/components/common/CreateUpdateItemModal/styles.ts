import styled from "styled-components";

export const Container = styled.div`
  .buttons-add {
    margin-top: 12px;
    button {
      height: 32px;
    }
  }
`;

type WrapperProps = {
  columns: string;
};
export const Wrapper = styled.div<WrapperProps>`
  margin: 2rem 1rem;
  display: grid;
  grid-template-columns: ${({ columns }) => columns};
  gap: 1rem;
`;
