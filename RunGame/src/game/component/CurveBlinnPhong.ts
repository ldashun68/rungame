
export default class CurveBlinnPhong extends Laya.BlinnPhongMaterial {

    public readonly MAIN_TEX: number = Laya.Shader3D.propertyNameToID("u_MainTex");
    public readonly X_OFFSET: number = Laya.Shader3D.propertyNameToID("u_XOffset");
    public readonly Y_OFFSET: number = Laya.Shader3D.propertyNameToID("u_YOffset");
    public readonly Z_Distance: number = Laya.Shader3D.propertyNameToID("u_ZDistance");

    constructor() {
        super();
        this.setShaderName("CustomCurveShader");
        this.enableVertexColor = false;
        this.albedoColor = new Laya.Vector4(0.0, 0.0, 0.0, 0.0);
        this.xoffset = 15.0;
        this.yoffset = -15.0;
        this.zdistance = 200.0;
    }

    public static initShader() {

        var attributeMap: object = {
            "a_Position": Laya.VertexMesh.MESH_POSITION0,
            "a_Normal": Laya.VertexMesh.MESH_NORMAL0,
            "a_Textcoord": Laya.VertexMesh.MESH_TEXTURECOORDINATE0,
            "a_Textcorrd1": Laya.VertexMesh.MESH_TEXTURECOORDINATE1,
            "a_Tangent": Laya.VertexMesh.MESH_TANGENT0,
            "a_Color": Laya.VertexMesh.MESH_COLOR0,
        }

        var uniformMap: object = {
            "u_MainTex": Laya.Shader3D.PERIOD_MATERIAL,
            "u_MvpMatrix": Laya.Shader3D.PERIOD_SPRITE,
            "u_View": Laya.Shader3D.PERIOD_CAMERA,
            "u_Projection": Laya.Shader3D.PERIOD_CAMERA,
            "u_WorldMat": Laya.Shader3D.PERIOD_SPRITE,
            "u_XOffset": Laya.Shader3D.PERIOD_MATERIAL,
            "u_YOffset": Laya.Shader3D.PERIOD_MATERIAL,
            "u_ZDistance": Laya.Shader3D.PERIOD_MATERIAL
        }

        var vs: string = `
            #include "Lighting.glsl";

            attribute vec4 a_Position;
            attribute vec2 a_Textcoord;

            uniform mat4 u_WorldMat;
            uniform mat4 u_MvpMatrix;
            uniform mat4 u_View;
            uniform mat4 u_Projection;

            uniform float u_XOffset;
            uniform float u_YOffset;
            uniform float u_ZDistance;

            varying vec2 v_textcoord;

            void main() {
                v_textcoord = a_Textcoord;
                vec4 vPos = (u_View * u_WorldMat) * a_Position;
                float zOff = vPos.z / u_ZDistance;
                vPos += vec4(u_XOffset, u_YOffset, 0.0, 0.0) * zOff * zOff;
                gl_Position = u_Projection * vPos;
            }
        `;

        var ps: string = `
            #ifdef HIGHPRECISION
            precision highp float;
            #else
            precision mediump float;
            #endif

            #include "Lighting.glsl";

            uniform sampler2D u_MainTex;
            varying vec2 v_textcoord;

            void main() {
                vec4 col = texture2D(u_MainTex, v_textcoord);
                gl_FragColor = col;
            }
        `;

        var shader: Laya.Shader3D = Laya.Shader3D.add("CustomCurveShader");
        var subShader: Laya.SubShader = new Laya.SubShader(attributeMap, uniformMap);
        shader.addSubShader(subShader);
        subShader.addShaderPass(vs, ps);
    }

    set mainTex(value: Laya.BaseTexture) {
        this._shaderValues.setTexture(this.MAIN_TEX, value);
    }

    set xoffset(value: number) {
        this._shaderValues.setNumber(this.X_OFFSET, value);
    }

    set yoffset(value: number) {
        this._shaderValues.setNumber(this.Y_OFFSET, value);
    }

    set zdistance(value: number) {
        this._shaderValues.setNumber(this.Z_Distance, value);
    }
}