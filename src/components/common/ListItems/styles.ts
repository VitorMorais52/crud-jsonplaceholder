import styled from "styled-components";

export const Container = styled.div`
  .add-item {
    justify-content: space-between;
    display: grid;
    grid-template-columns: auto 1fr auto;
    margin: 1rem;

    div:nth-child(2),
    label {
      margin-left: 0.5rem;
      margin-right: 1rem;
    }

    div:nth-child(3) {
      display: flex;
      justify-content: flex-end;
    }
  }

  .buttons-add {
    margin-top: 12px;
    button {
      height: 32px;
    }
  }
`;

export const Content = styled.div`
  display: flex;
  align-items: center;
  margin-right: 1rem;
`;

type StatusProps = {
  completed: boolean;
};
export const Status = styled.span<StatusProps>`
  color: ${({ completed }) => (completed ? "green" : "rgba(255,0,0,0.5)")};
  font-weight: 600;
`;
