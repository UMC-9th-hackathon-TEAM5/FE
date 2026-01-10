<<<<<<< HEAD
<<<<<<< HEAD
import { Button } from "../Button";
import BaseModal from "./BaseModal";
=======
import { Button } from "../Button";
import BaseModal from "./BaseModal"
>>>>>>> ffb1bd6 (feat : EndCofirmModal 구현)

interface EndConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
<<<<<<< HEAD
  onConfirm: () => void;
}

const EndConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
}: EndConfirmModalProps) => {
  return (
    <BaseModal isOpen={isOpen} onClose={onClose}>
      <div className="bg-main-dark2 flex h-50.5 w-85 flex-col gap-5 rounded-xl p-5">
        <div className="flex flex-col items-center justify-center gap-3">
          <div className="text-main text-[24px] font-bold">게임 종료</div>
          <div className="flex flex-col items-center justify-center gap-2 text-[16px] text-white">
            <p>게임이 진행 중입니다.</p>
            <p>게임을 종료할까요?</p>
          </div>
        </div>
        <Button width="lg" state="active" onClick={onConfirm}>
          게임 종료
        </Button>
      </div>
    </BaseModal>
  );
};

export default EndConfirmModal;
=======
const EndConfirmModal = () => {
=======
  onConfirm : () => void;
}

const EndConfirmModal = ({isOpen, onClose, onConfirm} : EndConfirmModalProps) => {

>>>>>>> ffb1bd6 (feat : EndCofirmModal 구현)
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
>>>>>>> 6c422b7 (feat : GameRuleModal 구현)
