import { Button } from "../Button";
import BaseModal from "./BaseModal"

interface EndConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm : () => void;
}

const EndConfirmModal = ({isOpen, onClose, onConfirm} : EndConfirmModalProps) => {

  return (
    <BaseModal isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col w-85 h-50.5 bg-main-dark2 p-5 gap-5 rounded-xl">
        <div className="flex flex-col gap-3 items-center justify-center">
          <div className="text-[24px] font-bold text-main">게임 종료</div>
          <div className="flex flex-col gap-2 items-center justify-center text-[16px] text-white">
            <p>게임이 진행 중입니다.</p>
            <p>게임을 종료할까요?</p>
          </div>
        </div>
        <Button width="lg" state="active" onClick={onConfirm}>게임 종료</Button>
      </div>
    </BaseModal>
  )
}

export default EndConfirmModal
