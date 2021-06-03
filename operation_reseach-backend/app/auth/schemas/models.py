from marshmallow import Schema, fields


class SuccessSchema(Schema):
    status = fields.Str(default='success', description='Статус ответа')
    code = fields.Str(allow_none=True, description='Код ответа')
    data = fields.Int(description='Содержимое ответа')


class SuccessJsonSchema(SuccessSchema):
    data = fields.Dict(description='Содержимое ответа')