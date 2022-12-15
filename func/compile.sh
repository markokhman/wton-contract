func -SPA -o ./build/jetton-wallet.fif -W ./build/jetton-wallet.boc common/stdlib.fc common/chains.fc common/messages.fc common/op-codes.fc common/packers.fc jetton-wallet.fc
fift -s ./build/jetton-wallet.fif

func -SPA -o ./build/jetton-minter.fif -W ./build/jetton-minter.boc common/stdlib.fc common/chains.fc common/messages.fc common/op-codes.fc common/packers.fc jetton-minter.generated.fc jetton-minter.fc
fift -s ./build/jetton-minter.fif
