from marshmallow import RAISE, Schema, fields, validate


class OrderedSchema(Schema):
    class Meta:
        ordered = True
        unknown = RAISE


class ArgsSchema(OrderedSchema):
    pass


class CreateUserArgsSchema(ArgsSchema):
    firstname = fields.Str(
        required=True,
        validate=validate.Length(min=1, error="Отсутствует имя"),
        error_messages={"required": "Отсутствует имя"},
    )
    lastname = fields.Str(
        required=True,
        validate=validate.Length(min=1, error="Отсутствует фамилия"),
        error_messages={"required": "Отсутствует фамилия"},
    )
    login = fields.Email(
        required=True,
        validate=validate.Email(error="Неправильный email"),
        error_messages={"required": "Отсутствует email"},
    )
    password = fields.Str(
        required=True,
        validate=validate.Length(
            min=6, error="Пароль должен быть длиной в минимум 6 символов"
        ),
        error_messages={"required": "Отсутствует пароль"},
    )
    permission_id = fields.Int(
        required=True,
        validate=validate.Range(min=1, error="Неправильная роль"),
        error_messages={"required": "Отсутствует роль"},
    )
    is_active = fields.Bool(
        required=True,
        validate=validate.OneOf(
            choices=[True, False], error="Неправильный выбор активности"
        ),
        error_messages={"required": "Отсутствует выбор активности"},
    )
    group_id = fields.Int(
        required=True,
        validate=validate.Range(min=1, error="Неправильная группа"),
        error_messages={"required": "Отсутствует группа"},
    )
    allowed_presentations = fields.Dict()


class CreateTestSchema(ArgsSchema):
    assignee = fields.Int(
        required=True,
        many=True
    )
    start_at = fields.DateTime(
        required=True,
    )
    finish_until = fields.DateTime(
        required=True,
    )
    is_rating = fields.Boolean(
        required=False,
        default=False
    )
    description = fields.Str()
    tasks = fields.Dict()




class UpdateUserArgsSchema(ArgsSchema):
    firstname = fields.Str(
        required=False,
        validate=validate.Length(min=1, error="Отсутствует имя"),
        error_messages={"required": "Отсутствует имя"},
    )
    lastname = fields.Str(
        required=False,
        validate=validate.Length(min=1, error="Отсутствует фамилия"),
        error_messages={"required": "Отсутствует фамилия"},
    )
    login = fields.Email(
        required=False,
        validate=validate.Email(error="Неправильный email"),
        error_messages={"required": "Отсутствует email"},
    )
    password = fields.Str(
        required=False,
        validate=validate.Length(
            min=6, error="Пароль должен быть длиной в минимум 6 символов"
        ),
        error_messages={"required": "Отсутствует пароль"},
    )
    permission_id = fields.Int(
        required=False,
        validate=validate.Range(min=1, error="Неправильная роль"),
        error_messages={"required": "Отсутствует роль"},
    )
    is_active = fields.Bool(
        required=False,
        validate=validate.OneOf(
            choices=[True, False], error="Неправильный выбор активности"
        ),
        error_messages={"required": "Отсутствует выбор активности"},
    )
    group_id = fields.Int(
        required=False,
        validate=validate.Range(min=1, error="Неправильная группа"),
        error_messages={"required": "Отсутствует группа"},
    )
    allowed_presentations = fields.Dict()


class DeleteUserArgsSchema(ArgsSchema):
    login = fields.Str(required=True, validate=validate.Length(min=1, error="Логин пустой"),
                       error_messages={"required": "Логин пустой"})


