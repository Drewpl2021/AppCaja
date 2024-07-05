package pe.upeu.auth.service;

import pe.upeu.auth.dto.AuthUserDto;
import pe.upeu.auth.entity.AuthUser;
import pe.upeu.auth.entity.TokenDto;

import java.util.List;

public interface AuthUserService {
    public AuthUser save(AuthUserDto authUserDto);

    public TokenDto login(AuthUserDto authUserDto);

    public TokenDto validate(String token);

    List<AuthUser> getAllUsers();
}
