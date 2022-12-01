func -SPA -o ./build/jetton-wallet.fif common/stdlib.fc common/chains.fc common/op-codes.fc common/packers.fc jetton-wallet.fc
echo '"build/jetton-wallet.fif" include 2 boc+>B "build/jetton-wallet.boc" B>file' | fift -s
func -SPA -o ./build/jetton-root.fif common/stdlib.fc common/chains.fc common/op-codes.fc common/packers.fc jetton-root.fc

fift -s build/print-hex.fif
