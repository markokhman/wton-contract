func -SPA -o ./build/jetton-root.fif -W ./build/jetton-root.boc common/stdlib.fc common/chains.fc common/messages.fc common/op-codes.fc common/packers.fc jetton-root.fc
func -SPA -o ./build/jetton-wallet.fif -W ./build/jetton-wallet.boc common/stdlib.fc common/chains.fc common/messages.fc common/op-codes.fc common/packers.fc jetton-wallet.fc

fift -s ./build/jetton-root.fif
fift -s ./build/jetton-wallet.fif
